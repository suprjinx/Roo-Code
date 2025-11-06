import type { ProviderSettings, OrganizationAllowList } from "@roo-code/types"
import { chutesDefaultModelId } from "@roo-code/types"
import { API_KEYS } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"

import { ApiKey } from "../ApiKey"
import type { RouterModels } from "@roo/api"

import { ModelPicker } from "../ModelPicker"
import { inputEventTransform } from "../transforms"

type ChutesProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	routerModels?: RouterModels
	organizationAllowList: OrganizationAllowList
	modelValidationError?: string
}

export const Chutes = ({
	apiConfiguration,
	setApiConfigurationField,
	routerModels,
	organizationAllowList,
	modelValidationError,
}: ChutesProps) => {
	const { t } = useAppTranslation()

	return (
		<>
			<ApiKey
				apiKey={apiConfiguration?.chutesApiKey || ""}
				apiKeyEnvVar={API_KEYS.CHUTES}
				configUseEnvVars={!!apiConfiguration?.chutesConfigUseEnvVars}
				setApiKey={(value: string) => setApiConfigurationField("chutesApiKey", value)}
				setConfigUseEnvVars={(value: boolean) => setApiConfigurationField("chutesConfigUseEnvVars", value)}
				apiKeyLabel={t("settings:providers.chutesApiKey")}
				getApiKeyUrl="https://chutes.ai/app/api"
				getApiKeyLabel={t("settings:providers.getChutesApiKey")}
			/>
			<ModelPicker
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				defaultModelId={chutesDefaultModelId}
				models={routerModels?.chutes ?? {}}
				modelIdKey="apiModelId"
				serviceName="Chutes AI"
				serviceUrl="https://llm.chutes.ai/v1/models"
				organizationAllowList={organizationAllowList}
				errorMessage={modelValidationError}
			/>
		</>
	)
}
