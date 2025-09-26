import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"
import { API_KEYS } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type FeatherlessProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const Featherless = ({ apiConfiguration, setApiConfigurationField }: FeatherlessProps) => {
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
				apiKey={apiConfiguration?.featherlessApiKey || ""}
				apiKeyEnvVar={API_KEYS.FEATHERLESS}
				configUseEnvVars={!!apiConfiguration?.featherlessConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("featherlessApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("featherlessConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.featherlessApiKey")}
				getApiKeyUrl="https://featherless.ai/account/api-keys"
				getApiKeyLabel={t("settings:providers.getFeatherlessApiKey")}
			/>
		</>
	)
}
