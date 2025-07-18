import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type DeepSeekProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const DeepSeek = ({ apiConfiguration, setApiConfigurationField }: DeepSeekProps) => {
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
				apiKey={apiConfiguration?.deepSeekApiKey || ""}
				apiKeyEnvVar="DEEP_SEEK_API_KEY"
				apiKeyUseEnvVar={!!apiConfiguration?.deepSeekApiKeyUseEnvVar}
				setApiKey={(value: string) => setApiConfigurationField("deepSeekApiKey", value)}
				setApiKeyUseEnvVar={(value: boolean) => setApiConfigurationField("deepSeekApiKeyUseEnvVar", value)}
				apiKeyLabel={t("settings:providers.deepSeekApiKey")}
				getApiKeyUrl="https://platform.deepseek.com/"
				getApiKeyLabel={t("settings:providers.getDeepSeekApiKey")}
			/>
		</>
	)
}
