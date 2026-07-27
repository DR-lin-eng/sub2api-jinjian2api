package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/tidwall/gjson"
)

// SanitizeOpenAICrossModeFailoverReasoning derives a failover attempt body from
// the canonical request by dropping provider-specific encrypted reasoning items.
// The input slice remains immutable and a distinct slice is returned only when
// the request actually changes.
func SanitizeOpenAICrossModeFailoverReasoning(body []byte) (sanitized []byte, changed bool, err error) {
	if !openAIHasEncryptedReasoningInput(body) {
		return body, false, nil
	}

	var decoded map[string]any
	decoder := json.NewDecoder(bytes.NewReader(body))
	decoder.UseNumber()
	if err := decoder.Decode(&decoded); err != nil {
		return body, false, fmt.Errorf("decode cross-mode failover body: %w", err)
	}
	if !dropOpenAIEncryptedReasoningInputItems(decoded) {
		return body, false, nil
	}
	out, marshalErr := marshalOpenAIUpstreamJSON(decoded)
	if marshalErr != nil {
		return body, false, fmt.Errorf("serialize cross-mode failover body: %w", marshalErr)
	}
	return out, true, nil
}

func openAIHasEncryptedReasoningInput(body []byte) bool {
	if len(body) == 0 {
		return false
	}
	hasEscapedJSONToken := bytes.Contains(body, []byte(`\u`))
	if (!bytes.Contains(body, []byte(`"reasoning"`)) || !bytes.Contains(body, []byte(`"encrypted_content"`))) && !hasEscapedJSONToken {
		return false
	}

	input := gjson.GetBytes(body, "input")
	if input.IsArray() {
		found := false
		input.ForEach(func(_, item gjson.Result) bool {
			found = gjsonOpenAIEncryptedReasoningItem(item)
			return !found
		})
		return found
	}
	return gjsonOpenAIEncryptedReasoningItem(input)
}

func gjsonOpenAIEncryptedReasoningItem(item gjson.Result) bool {
	return item.IsObject() &&
		strings.TrimSpace(item.Get("type").String()) == "reasoning" &&
		item.Get("encrypted_content").Raw != ""
}

// dropOpenAIEncryptedReasoningInputItems removes reasoning input items carrying
// encrypted_content in full, including their coupled id and summary fields.
func dropOpenAIEncryptedReasoningInputItems(reqBody map[string]any) bool {
	if len(reqBody) == 0 {
		return false
	}
	inputValue, has := reqBody["input"]
	if !has {
		return false
	}
	switch input := inputValue.(type) {
	case []any:
		filtered := input[:0]
		changed := false
		for _, item := range input {
			if isOpenAIEncryptedReasoningInputItem(item) {
				changed = true
				continue
			}
			filtered = append(filtered, item)
		}
		if !changed {
			return false
		}
		if len(filtered) == 0 {
			delete(reqBody, "input")
			return true
		}
		reqBody["input"] = filtered
		return true
	case []map[string]any:
		filtered := input[:0]
		changed := false
		for _, item := range input {
			if isOpenAIEncryptedReasoningInputItem(item) {
				changed = true
				continue
			}
			filtered = append(filtered, item)
		}
		if !changed {
			return false
		}
		if len(filtered) == 0 {
			delete(reqBody, "input")
			return true
		}
		reqBody["input"] = filtered
		return true
	case map[string]any:
		if isOpenAIEncryptedReasoningInputItem(input) {
			delete(reqBody, "input")
			return true
		}
	}
	return false
}

func isOpenAIEncryptedReasoningInputItem(item any) bool {
	inputItem, ok := item.(map[string]any)
	if !ok {
		return false
	}
	if itemType, _ := inputItem["type"].(string); strings.TrimSpace(itemType) != "reasoning" {
		return false
	}
	_, has := inputItem["encrypted_content"]
	return has
}
