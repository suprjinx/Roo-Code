import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type XAIProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const XAI = ({ apiConfiguration, setApiConfigurationField }: XAIProps) => {
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
				apiKey={apiConfiguration?.xaiApiKey || ""}
				apiKeyEnvVar="XAI_API_KEY"
				apiKeyUseEnvVar={!!apiConfiguration?.xaiApiKeyUseEnvVar}
				setApiKey={(value: string) => setApiConfigurationField("xaiApiKey", value)}
				setApiKeyUseEnvVar={(value: boolean) => setApiConfigurationField("xaiApiKeyUseEnvVar", value)}
				apiKeyLabel={t("settings:providers.xaiApiKey")}
				getApiKeyUrl="https://api.x.ai/docs"
				getApiKeyLabel={t("settings:providers.getXaiApiKey")}
			/>
		</>
	)
}
