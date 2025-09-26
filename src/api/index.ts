import { Anthropic } from "@anthropic-ai/sdk"

import type { ProviderSettings, ModelInfo } from "@roo-code/types"

import { ApiStream } from "./transform/stream"

import {
	GlamaHandler,
	AnthropicHandler,
	AwsBedrockHandler,
	CerebrasHandler,
	OpenRouterHandler,
	VertexHandler,
	AnthropicVertexHandler,
	OpenAiHandler,
	LmStudioHandler,
	GeminiHandler,
	OpenAiNativeHandler,
	DeepSeekHandler,
	MoonshotHandler,
	MistralHandler,
	VsCodeLmHandler,
	UnboundHandler,
	RequestyHandler,
	HumanRelayHandler,
	FakeAIHandler,
	XAIHandler,
	GroqHandler,
	HuggingFaceHandler,
	ChutesHandler,
	LiteLLMHandler,
	ClaudeCodeHandler,
	QwenCodeHandler,
	SambaNovaHandler,
	IOIntelligenceHandler,
	DoubaoHandler,
	ZAiHandler,
	FireworksHandler,
	RooHandler,
	FeatherlessHandler,
	VercelAiGatewayHandler,
	DeepInfraHandler,
} from "./providers"
import { NativeOllamaHandler } from "./providers/native-ollama"

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export interface ApiHandlerCreateMessageMetadata {
	mode?: string
	taskId: string
	previousResponseId?: string
	/**
	 * When true, the provider must NOT fall back to internal continuity state
	 * (e.g., lastResponseId) if previousResponseId is absent.
	 * Used to enforce "skip once" after a condense operation.
	 */
	suppressPreviousResponseId?: boolean
	/**
	 * Controls whether the response should be stored for 30 days in OpenAI's Responses API.
	 * When true (default), responses are stored and can be referenced in future requests
	 * using the previous_response_id for efficient conversation continuity.
	 * Set to false to opt out of response storage for privacy or compliance reasons.
	 * @default true
	 */
	store?: boolean
}

export interface ApiHandler {
	createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
		metadata?: ApiHandlerCreateMessageMetadata,
	): ApiStream

	getModel(): { id: string; info: ModelInfo }

	/**
	 * Counts tokens for content blocks
	 * All providers extend BaseProvider which provides a default tiktoken implementation,
	 * but they can override this to use their native token counting endpoints
	 *
	 * @param content The content to count tokens for
	 * @returns A promise resolving to the token count
	 */
	countTokens(content: Array<Anthropic.Messages.ContentBlockParam>): Promise<number>
}

/**
 * Read an environment variable value, returning a default value if not set. If neither key nor default is set,
 * returns undefined
 * @param key The environment variable key
 * @param defaultValue The default value to return if the variable is not set
 * @returns The value of the environment variable or the default value
 */
export function getEnvVar(key: string | undefined, defaultValue?: string | undefined): string | undefined {
	if (key === undefined) {
		return defaultValue
	}
	return process.env[key as string] ?? defaultValue
}

export function buildApiHandler(configuration: ProviderSettings): ApiHandler {
	const { apiProvider, ...options } = configuration

	switch (apiProvider) {
		case "anthropic":
			if (options.anthropicConfigUseEnvVars) {
				options.apiKey = getEnvVar("ANTHROPIC_API_KEY", options.apiKey)
			}
			return new AnthropicHandler(options)
		case "claude-code":
			return new ClaudeCodeHandler(options)
		case "glama":
			if (options.glamaConfigUseEnvVars) {
				options.glamaApiKey = getEnvVar("GLAMA_API_KEY", options.glamaApiKey)
			}
			return new GlamaHandler(options)
		case "openrouter":
			if (options.openRouterConfigUseEnvVars) {
				options.openRouterApiKey = getEnvVar("OPENROUTER_API_KEY", options.openRouterApiKey)
			}
			return new OpenRouterHandler(options)
		case "bedrock":
			return new AwsBedrockHandler(options)
		case "vertex":
			return options.apiModelId?.startsWith("claude")
				? new AnthropicVertexHandler(options)
				: new VertexHandler(options)
		case "openai":
			if (options.openAiConfigUseEnvVars) {
				options.openAiApiKey = getEnvVar("OPENAI_API_KEY", options.openAiApiKey)
			}
			return new OpenAiHandler(options)
		case "ollama":
			return new NativeOllamaHandler(options)
		case "lmstudio":
			return new LmStudioHandler(options)
		case "gemini":
			if (options.geminiConfigUseEnvVars) {
				options.geminiApiKey = getEnvVar("GEMINI_API_KEY", options.geminiApiKey)
			}
			return new GeminiHandler(options)
		case "openai-native":
			if (options.openAiNativeConfigUseEnvVars) {
				options.openAiNativeApiKey = getEnvVar("OPENAI_API_KEY", options.openAiNativeApiKey)
			}
			return new OpenAiNativeHandler(options)
		case "deepseek":
			if (options.deepSeekConfigUseEnvVars) {
				options.deepSeekApiKey = getEnvVar("DEEPSEEK_API_KEY", options.deepSeekApiKey)
			}
			return new DeepSeekHandler(options)
		case "doubao":
			if (options.doubaoConfigUseEnvVars) {
				options.doubaoApiKey = getEnvVar("DOUBAO_API_KEY", options.doubaoApiKey)
			}
			return new DoubaoHandler(options)
		case "qwen-code":
			return new QwenCodeHandler(options)
		case "moonshot":
			if (options.moonshotConfigUseEnvVars) {
				options.moonshotApiKey = getEnvVar("MOONSHOT_API_KEY", options.moonshotApiKey)
			}
			return new MoonshotHandler(options)
		case "vscode-lm":
			return new VsCodeLmHandler(options)
		case "mistral":
			if (options.mistralConfigUseEnvVars) {
				options.mistralApiKey = getEnvVar("MISTRAL_API_KEY", options.mistralApiKey)
			}
			return new MistralHandler(options)
		case "unbound":
			if (options.unboundConfigUseEnvVars) {
				options.unboundApiKey = getEnvVar("UNBOUND_API_KEY", options.unboundApiKey)
			}
			return new UnboundHandler(options)
		case "requesty":
			if (options.requestyConfigUseEnvVars) {
				options.requestyApiKey = getEnvVar("REQUESTY_API_KEY", options.requestyApiKey)
			}
			return new RequestyHandler(options)
		case "human-relay":
			return new HumanRelayHandler()
		case "fake-ai":
			return new FakeAIHandler(options)
		case "xai":
			if (options.xaiConfigUseEnvVars) {
				options.xaiApiKey = getEnvVar("XAI_API_KEY", options.xaiApiKey)
			}
			return new XAIHandler(options)
		case "groq":
			if (options.groqConfigUseEnvVars) {
				options.groqApiKey = getEnvVar("GROQ_API_KEY", options.groqApiKey)
			}
			return new GroqHandler(options)
		case "deepinfra":
			if (options.deepInfraConfigUseEnvVars) {
				options.deepInfraApiKey = getEnvVar("DEEPINFRA_API_KEY", options.deepInfraApiKey)
			}
			return new DeepInfraHandler(options)
		case "huggingface":
			if (options.huggingFaceConfigUseEnvVars) {
				options.huggingFaceApiKey = getEnvVar("HUGGINGFACE_API_KEY", options.huggingFaceApiKey)
			}
			return new HuggingFaceHandler(options)
		case "chutes":
			if (options.chutesConfigUseEnvVars) {
				options.chutesApiKey = getEnvVar("CHUTES_API_KEY", options.chutesApiKey)
			}
			return new ChutesHandler(options)
		case "litellm":
			if (options.litellmConfigUseEnvVars) {
				options.litellmApiKey = getEnvVar("LITELLM_API_KEY", options.litellmApiKey)
			}
			return new LiteLLMHandler(options)
		case "cerebras":
			if (options.cerebrasConfigUseEnvVars) {
				options.cerebrasApiKey = getEnvVar("CEREBRAS_API_KEY", options.cerebrasApiKey)
			}
			return new CerebrasHandler(options)
		case "sambanova":
			if (options.sambaNovaConfigUseEnvVars) {
				options.sambaNovaApiKey = getEnvVar("SAMBANOVA_API_KEY", options.sambaNovaApiKey)
			}
			return new SambaNovaHandler(options)
		case "zai":
			if (options.zaiConfigUseEnvVars) {
				options.zaiApiKey = getEnvVar("ZAI_API_KEY", options.zaiApiKey)
			}
			return new ZAiHandler(options)
		case "fireworks":
			if (options.fireworksConfigUseEnvVars) {
				options.fireworksApiKey = getEnvVar("FIREWORKS_API_KEY", options.fireworksApiKey)
			}
			return new FireworksHandler(options)
		case "io-intelligence":
			if (options.ioIntelligenceConfigUseEnvVars) {
				options.ioIntelligenceApiKey = getEnvVar("IOINTELLIGENCE_API_KEY", options.ioIntelligenceApiKey)
			}
			return new IOIntelligenceHandler(options)
		case "roo":
			// Never throw exceptions from provider constructors
			// The provider-proxy server will handle authentication and return appropriate error codes
			return new RooHandler(options)
		case "featherless":
			if (options.featherlessConfigUseEnvVars) {
				options.featherlessApiKey = getEnvVar("FEATHERLESS_API_KEY", options.featherlessApiKey)
			}
			return new FeatherlessHandler(options)
		case "vercel-ai-gateway":
			if (options.vercelConfigUseEnvVars) {
				options.vercelAiGatewayApiKey = getEnvVar("VERCEL_API_KEY", options.vercelAiGatewayApiKey)
			}
			return new VercelAiGatewayHandler(options)
		default:
			apiProvider satisfies "gemini-cli" | undefined
			return new AnthropicHandler(options)
	}
}
