package service

// Prompt Audit protocol labels are shared by transport adapters when building
// the audit request. They are protocol names, not a second moderation engine.
const (
	PromptAuditProtocolAnthropicMessages = "anthropic_messages"
	PromptAuditProtocolOpenAIResponses   = "openai_responses"
	PromptAuditProtocolOpenAIChat        = "openai_chat_completions"
	PromptAuditProtocolGemini            = "gemini"
	PromptAuditProtocolOpenAIImages      = "openai_images"
)
