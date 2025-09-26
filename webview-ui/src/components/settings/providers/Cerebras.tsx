import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"
import { API_KEYS } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type CerebrasProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const Cerebras = ({ apiConfiguration, setApiConfigurationField }: CerebrasProps) => {
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
				apiKey={apiConfiguration?.cerebrasApiKey || ""}
				apiKeyEnvVar={API_KEYS.CEREBRAS}
				configUseEnvVars={!!apiConfiguration?.cerebrasConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("cerebrasApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("cerebrasConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.cerebrasApiKey")}
				getApiKeyUrl="https://cloud.cerebras.ai?utm_source=roocode"
				getApiKeyLabel={t("settings:providers.getCerebrasApiKey")}
			/>
		</>
	)
}
