import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { RouterModels, glamaDefaultModelId } from "@roo/api"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { getGlamaAuthUrl } from "@src/oauth/urls"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform } from "../transforms"
import { ModelPicker } from "../ModelPicker"
import { ApiKey } from "../ApiKey"

type GlamaProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	routerModels?: RouterModels
	uriScheme?: string
}

export const Glama = ({ apiConfiguration, setApiConfigurationField, routerModels, uriScheme }: GlamaProps) => {
	const { t } = useAppTranslation()

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = inputEventTransform,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	return (
		<>
			<ApiKey
				apiKey={apiConfiguration?.glamaApiKey || ""}
				apiKeyEnvVar="GLAMA_API_KEY"
				apiKeyUseEnvVar={!!apiConfiguration?.glamaApiKeyUseEnvVar}
				setApiKey={(value: string) => setApiConfigurationField("glamaApiKey", value)}
				setApiKeyUseEnvVar={(value: boolean) => setApiConfigurationField("glamaApiKeyUseEnvVar", value)}
				apiKeyLabel={t("settings:providers.glamaApiKey")}
				getApiKeyUrl={getGlamaAuthUrl(uriScheme)}
				getApiKeyLabel={t("settings:providers.getGlamaApiKey")}
			/>
			<ModelPicker
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				defaultModelId={glamaDefaultModelId}
				models={routerModels?.glama ?? {}}
				modelIdKey="glamaModelId"
				serviceName="Glama"
				serviceUrl="https://glama.ai/models"
			/>
		</>
	)
}
