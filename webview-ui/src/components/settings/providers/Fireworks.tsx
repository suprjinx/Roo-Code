import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"
import { API_KEYS } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type FireworksProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const Fireworks = ({ apiConfiguration, setApiConfigurationField }: FireworksProps) => {
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
				apiKey={apiConfiguration?.fireworksApiKey || ""}
				apiKeyEnvVar={API_KEYS.FIREWORKS}
				configUseEnvVars={!!apiConfiguration?.fireworksConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("fireworksApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("fireworksConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.fireworksApiKey")}
				getApiKeyUrl="https://fireworks.ai/"
				getApiKeyLabel={t("settings:providers.getFireworksApiKey")}
			/>
		</>
	)
}
