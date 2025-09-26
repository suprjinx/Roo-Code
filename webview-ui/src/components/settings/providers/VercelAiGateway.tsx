import { useCallback } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import { type ProviderSettings, type OrganizationAllowList, vercelAiGatewayDefaultModelId, API_KEYS } from "@roo-code/types"

import type { RouterModels } from "@roo/api"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform } from "../transforms"
import { ModelPicker } from "../ModelPicker"
import { ApiKey } from "../ApiKey"

type VercelAiGatewayProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	routerModels?: RouterModels
	organizationAllowList: OrganizationAllowList
	modelValidationError?: string
}

export const VercelAiGateway = ({
	apiConfiguration,
	setApiConfigurationField,
	routerModels,
	organizationAllowList,
	modelValidationError,
}: VercelAiGatewayProps) => {
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
				apiKey={apiConfiguration?.vercelAiGatewayApiKey || ""}
				apiKeyEnvVar={API_KEYS.VERCEL_NOVA}
				configUseEnvVars={!!apiConfiguration?.vercelConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("vercelAiGatewayApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("vercelConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.vercelAiGatewayApiKey")}
				getApiKeyUrl="https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=AI+Gateway+API+Key"
				getApiKeyLabel={t("settings:providers.getVercelAiGatewayApiKey")}
			/>
			<ModelPicker
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				defaultModelId={vercelAiGatewayDefaultModelId}
				models={routerModels?.["vercel-ai-gateway"] ?? {}}
				modelIdKey="vercelAiGatewayModelId"
				serviceName="Vercel AI Gateway"
				serviceUrl="https://vercel.com/ai-gateway/models"
				organizationAllowList={organizationAllowList}
				errorMessage={modelValidationError}
			/>
		</>
	)
}
