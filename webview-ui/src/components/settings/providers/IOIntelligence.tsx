import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import {
	type ProviderSettings,
	type OrganizationAllowList,
	ioIntelligenceDefaultModelId,
	ioIntelligenceModels,
	API_KEYS,
} from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"
import { useExtensionState } from "@src/context/ExtensionStateContext"

import { ModelPicker } from "../ModelPicker"

import { inputEventTransform } from "../transforms"
import { ApiKey } from "../ApiKey"

type IOIntelligenceProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	organizationAllowList: OrganizationAllowList
	modelValidationError?: string
}

export const IOIntelligence = ({
	apiConfiguration,
	setApiConfigurationField,
	organizationAllowList,
	modelValidationError,
}: IOIntelligenceProps) => {
	const { t } = useAppTranslation()
	const { routerModels } = useExtensionState()

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
				apiKey={apiConfiguration?.ioIntelligenceApiKey || ""}
				apiKeyEnvVar={API_KEYS.IO_INTELLIGENCE}
				configUseEnvVars={!!apiConfiguration?.ioIntelligenceConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("ioIntelligenceApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("ioIntelligenceConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.ioIntelligenceApiKey")}
				getApiKeyUrl="https://ai.io.net/ai/api-keys"
				getApiKeyLabel={t("settings:providers.getIoIntelligenceApiKey")}
			/>
			<ModelPicker
				apiConfiguration={apiConfiguration}
				defaultModelId={ioIntelligenceDefaultModelId}
				models={routerModels?.["io-intelligence"] ?? ioIntelligenceModels}
				modelIdKey="ioIntelligenceModelId"
				serviceName="IO Intelligence"
				serviceUrl="https://api.intelligence.io.solutions/api/v1/models"
				setApiConfigurationField={setApiConfigurationField}
				organizationAllowList={organizationAllowList}
				errorMessage={modelValidationError}
			/>
		</>
	)
}
