package antigravity

import (
	"encoding/json"
	"fmt"
)

// ClaudeStreamEventSink consumes typed Claude events emitted by StreamingProcessor.
// Returning an error stops delivery for the current ProcessLineEvents call.
type ClaudeStreamEventSink interface {
	ConsumeClaudeStreamEvent(ClaudeStreamEvent) error
}

type ClaudeStreamEvent struct {
	Type         string
	Message      *ClaudeStreamMessage
	Index        *int
	ContentBlock *ClaudeStreamContentBlock
	Delta        *ClaudeStreamDelta
	Usage        *ClaudeUsage
	PayloadBytes int
}

type ClaudeStreamMessage struct {
	ID           string
	Type         string
	Role         string
	Model        string
	StopReason   *string
	StopSequence *string
	Usage        ClaudeUsage
}

type ClaudeStreamContentBlock struct {
	Type      string
	Text      string
	Thinking  string
	Signature string
	ID        string
	Name      string
	Input     json.RawMessage
	Source    *ImageSource
}

type ClaudeStreamDelta struct {
	Type         string
	Text         string
	Thinking     string
	Signature    string
	PartialJSON  string
	StopReason   string
	StopSequence *string
}

func claudeStreamEventFromWire(eventType string, data any) (ClaudeStreamEvent, error) {
	root, ok := data.(map[string]any)
	if !ok {
		return ClaudeStreamEvent{}, fmt.Errorf("claude stream event %s has unsupported payload %T", eventType, data)
	}
	event := ClaudeStreamEvent{Type: claudeEventString(root["type"])}
	if event.Type == "" {
		event.Type = eventType
	}
	if rawMessage, ok := root["message"].(map[string]any); ok {
		event.Message = &ClaudeStreamMessage{
			ID:           claudeEventString(rawMessage["id"]),
			Type:         claudeEventString(rawMessage["type"]),
			Role:         claudeEventString(rawMessage["role"]),
			Model:        claudeEventString(rawMessage["model"]),
			StopReason:   claudeEventOptionalString(rawMessage["stop_reason"]),
			StopSequence: claudeEventOptionalString(rawMessage["stop_sequence"]),
			Usage:        claudeEventUsage(rawMessage["usage"]),
		}
	}
	if index, ok := claudeEventInt(root["index"]); ok {
		event.Index = &index
	}
	if rawBlock, ok := root["content_block"].(map[string]any); ok {
		block := &ClaudeStreamContentBlock{
			Type:      claudeEventString(rawBlock["type"]),
			Text:      claudeEventString(rawBlock["text"]),
			Thinking:  claudeEventString(rawBlock["thinking"]),
			Signature: claudeEventString(rawBlock["signature"]),
			ID:        claudeEventString(rawBlock["id"]),
			Name:      claudeEventString(rawBlock["name"]),
		}
		if input, exists := rawBlock["input"]; exists {
			block.Input = claudeEventRawJSON(input)
		}
		if rawSource, ok := rawBlock["source"].(map[string]any); ok {
			block.Source = &ImageSource{
				Type:      claudeEventString(rawSource["type"]),
				MediaType: claudeEventString(rawSource["media_type"]),
				Data:      claudeEventString(rawSource["data"]),
			}
		}
		event.ContentBlock = block
	}
	if rawDelta, ok := root["delta"].(map[string]any); ok {
		event.Delta = &ClaudeStreamDelta{
			Type:         claudeEventString(rawDelta["type"]),
			Text:         claudeEventString(rawDelta["text"]),
			Thinking:     claudeEventString(rawDelta["thinking"]),
			Signature:    claudeEventString(rawDelta["signature"]),
			PartialJSON:  claudeEventString(rawDelta["partial_json"]),
			StopReason:   claudeEventString(rawDelta["stop_reason"]),
			StopSequence: claudeEventOptionalString(rawDelta["stop_sequence"]),
		}
	}
	if rawUsage, exists := root["usage"]; exists {
		usage := claudeEventUsage(rawUsage)
		event.Usage = &usage
	}
	event.PayloadBytes = event.approximatePayloadBytes()
	return event, nil
}

func (e ClaudeStreamEvent) approximatePayloadBytes() int {
	size := 256 + len(e.Type)
	if e.Message != nil {
		size += len(e.Message.ID) + len(e.Message.Type) + len(e.Message.Role) + len(e.Message.Model)
	}
	if e.ContentBlock != nil {
		size += len(e.ContentBlock.Type) + len(e.ContentBlock.Text) + len(e.ContentBlock.Thinking) +
			len(e.ContentBlock.Signature) + len(e.ContentBlock.ID) + len(e.ContentBlock.Name) + len(e.ContentBlock.Input)
		if e.ContentBlock.Source != nil {
			size += len(e.ContentBlock.Source.Type) + len(e.ContentBlock.Source.MediaType) + len(e.ContentBlock.Source.Data)
		}
	}
	if e.Delta != nil {
		size += len(e.Delta.Type) + len(e.Delta.Text) + len(e.Delta.Thinking) + len(e.Delta.Signature) +
			len(e.Delta.PartialJSON) + len(e.Delta.StopReason)
		if e.Delta.StopSequence != nil {
			size += len(*e.Delta.StopSequence)
		}
	}
	return size
}

func claudeEventUsage(value any) ClaudeUsage {
	if usage, ok := value.(ClaudeUsage); ok {
		return usage
	}
	raw, _ := value.(map[string]any)
	inputTokens, _ := claudeEventInt(raw["input_tokens"])
	outputTokens, _ := claudeEventInt(raw["output_tokens"])
	cacheCreation, _ := claudeEventInt(raw["cache_creation_input_tokens"])
	cacheRead, _ := claudeEventInt(raw["cache_read_input_tokens"])
	imageOutput, _ := claudeEventInt(raw["image_output_tokens"])
	return ClaudeUsage{
		InputTokens:              inputTokens,
		OutputTokens:             outputTokens,
		CacheCreationInputTokens: cacheCreation,
		CacheReadInputTokens:     cacheRead,
		ImageOutputTokens:        imageOutput,
	}
}

func claudeEventRawJSON(value any) json.RawMessage {
	if value == nil {
		return json.RawMessage("null")
	}
	if raw, ok := value.(json.RawMessage); ok {
		return raw
	}
	if object, ok := value.(map[string]any); ok && len(object) == 0 {
		return json.RawMessage("{}")
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return nil
	}
	return encoded
}

func claudeEventOptionalString(value any) *string {
	text, ok := value.(string)
	if !ok {
		return nil
	}
	return &text
}

func claudeEventString(value any) string {
	text, _ := value.(string)
	return text
}

func claudeEventInt(value any) (int, bool) {
	switch number := value.(type) {
	case int:
		return number, true
	case int64:
		return int(number), true
	case float64:
		return int(number), true
	case json.Number:
		parsed, err := number.Int64()
		return int(parsed), err == nil
	default:
		return 0, false
	}
}
