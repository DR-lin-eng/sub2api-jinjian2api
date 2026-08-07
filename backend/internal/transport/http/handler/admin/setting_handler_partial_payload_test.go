//go:build unit

package admin

import (
	"maps"
	"net/http"
	"reflect"
	"strings"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/stretchr/testify/require"
)

func TestSettingKeyJSONAliasesAreCompleteAndValid(t *testing.T) {
	require.Equal(t, map[string]string{
		"smtp_from_email": service.SettingKeySMTPFrom,
	}, settingKeyJSONAliases)

	requestType := reflect.TypeOf(UpdateSettingsRequest{})
	requestFields := make(map[string]reflect.StructField, requestType.NumField())
	for i := 0; i < requestType.NumField(); i++ {
		field := requestType.Field(i)
		jsonName, _, _ := strings.Cut(field.Tag.Get("json"), ",")
		if jsonName != "" && jsonName != "-" {
			requestFields[jsonName] = field
		}
	}
	for jsonName, settingKey := range settingKeyJSONAliases {
		field, ok := requestFields[jsonName]
		require.Truef(t, ok, "alias %q must name an UpdateSettingsRequest field", jsonName)
		require.NotEqual(t, reflect.Ptr, field.Type.Kind(), "pointer fields already carry presence")
		require.NotEqual(t, jsonName, settingKey, "identity mappings do not belong in the alias table")
		require.Equal(t, settingKey, settingKeyByJSONName[jsonName])
	}
}

func TestOmittedUpdateSettingsMergeCoverage(t *testing.T) {
	require.Empty(t, omittedUpdateSettingsMergeExclusions)
	require.Len(t, omittedUpdateSettingsFieldConverters, 1)
	require.Contains(t, omittedUpdateSettingsFieldConverters, "TablePageSizeOptions")

	requestType := reflect.TypeOf(UpdateSettingsRequest{})
	settingsType := reflect.TypeOf(service.SystemSettings{})
	for i := 0; i < requestType.NumField(); i++ {
		requestField := requestType.Field(i)
		if requestField.Type.Kind() == reflect.Ptr {
			continue
		}
		jsonName, _, _ := strings.Cut(requestField.Tag.Get("json"), ",")
		if jsonName == "" || jsonName == "-" {
			continue
		}

		settingsField, hasSettingsField := settingsType.FieldByName(requestField.Name)
		converter, converted := omittedUpdateSettingsFieldConverters[requestField.Name]
		switch {
		case converted:
			require.True(t, hasSettingsField)
			convertedValue := reflect.ValueOf(converter(&service.SystemSettings{}))
			require.True(t, convertedValue.Type().AssignableTo(requestField.Type))
		case !hasSettingsField:
			t.Errorf("value field %s must be assignable or converted", requestField.Name)
		default:
			require.True(t, settingsField.Type.AssignableTo(requestField.Type))
			require.NotContains(t, []reflect.Kind{reflect.Slice, reflect.Map}, requestField.Type.Kind())
		}
	}
}

func TestMergeOmittedUpdateSettingsRequestClonesTableOptions(t *testing.T) {
	previous := &service.SystemSettings{TablePageSizeOptions: []int{10, 20}}
	var req UpdateSettingsRequest

	mergeOmittedUpdateSettingsRequest(&req, previous, nil)
	req.TablePageSizeOptions[0] = 100

	require.Equal(t, []int{10, 20}, previous.TablePageSizeOptions)
}

func TestUpdateSettingsPartialPayloadKeepsUnsentKeys(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{
		service.SettingKeySiteName:   "Example Gateway",
		service.SettingKeyAPIBaseURL: "https://api.example.com",
		service.SettingKeySMTPHost:   "smtp.example.com",
		service.SettingKeySMTPFrom:   "noreply@example.com",
	})

	rec := doUpdateSettings(t, h, map[string]any{"risk_control_enabled": true}, nil)
	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, "true", repo.values[service.SettingKeyRiskControlEnabled])
	require.Equal(t, "Example Gateway", repo.values[service.SettingKeySiteName])
	require.Equal(t, "https://api.example.com", repo.values[service.SettingKeyAPIBaseURL])
	require.Equal(t, "smtp.example.com", repo.values[service.SettingKeySMTPHost])
	require.Equal(t, "noreply@example.com", repo.values[service.SettingKeySMTPFrom])
}

func TestUpdateSettingsPartialPayloadMergesStoredCrossFieldValues(t *testing.T) {
	stored := map[string]string{service.SettingKeyMinCodexVersion: "0.200.0"}
	h, repo := newStepUpSwitchTestHandler(t, maps.Clone(stored))

	rec := doUpdateSettings(t, h, map[string]any{"max_codex_version": "0.100.0"}, nil)

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Contains(t, rec.Body.String(), "max_codex_version must be greater than or equal to min_codex_version")
	require.Equal(t, stored, repo.values)
	require.Nil(t, repo.lastUpdates)
}

func TestUpdateSettingsFullPayloadStillClearsSentEmptyFields(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{service.SettingKeySiteName: "Example Gateway"})

	rec := doUpdateSettings(t, h, map[string]any{"site_name": ""}, nil)
	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, "", repo.values[service.SettingKeySiteName])
}

func TestUpdateSettingsSMTPFromAliasIsWritable(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{service.SettingKeySMTPFrom: "old@example.com"})

	rec := doUpdateSettings(t, h, map[string]any{"smtp_from_email": "new@example.com"}, nil)
	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, "new@example.com", repo.values[service.SettingKeySMTPFrom])
}

func TestUpdateSettingsPartialPayloadPreservesCodexVersions(t *testing.T) {
	stored := map[string]string{
		service.SettingKeyOpenAICodexClientVersion:       "0.150.0",
		service.SettingKeyOpenAICodexClientVersionSynced: "0.151.0",
	}
	h, repo := newStepUpSwitchTestHandler(t, maps.Clone(stored))

	rec := doUpdateSettings(t, h, map[string]any{"risk_control_enabled": true}, nil)

	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, "0.150.0", repo.values[service.SettingKeyOpenAICodexClientVersion])
	require.Equal(t, "0.151.0", repo.values[service.SettingKeyOpenAICodexClientVersionSynced])
}

func TestUpdateSettingsRejectsInvalidCodexClientVersion(t *testing.T) {
	stored := map[string]string{service.SettingKeyOpenAICodexClientVersion: "0.150.0"}
	h, repo := newStepUpSwitchTestHandler(t, maps.Clone(stored))

	rec := doUpdateSettings(t, h, map[string]any{"openai_codex_client_version": "latest"}, nil)

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Contains(t, rec.Body.String(), "openai_codex_client_version must be empty or a valid version")
	require.Equal(t, stored, repo.values)
	require.Nil(t, repo.lastUpdates)
}

func TestUpdateSettingsCannotWriteSynchronizedCodexVersion(t *testing.T) {
	stored := map[string]string{service.SettingKeyOpenAICodexClientVersionSynced: "0.151.0"}
	h, repo := newStepUpSwitchTestHandler(t, maps.Clone(stored))

	rec := doUpdateSettings(t, h, map[string]any{
		"openai_codex_client_version_synced": "9.9.9",
		"risk_control_enabled":               true,
	}, nil)

	require.Equal(t, http.StatusOK, rec.Code)
	require.Equal(t, "0.151.0", repo.values[service.SettingKeyOpenAICodexClientVersionSynced])
	require.NotContains(t, repo.lastUpdates, service.SettingKeyOpenAICodexClientVersionSynced)
}
