import { useCallback, useState } from "react"
import { Checkbox } from "vscrui"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform, noTransform } from "../transforms"

type AnthropicProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	env?: Record<string, string | undefined>
}

export const Anthropic = ({ apiConfiguration, setApiConfigurationField, env = {}}: AnthropicProps) => {
	const { t } = useAppTranslation()
	
	const apiKeyEnvVarExists = !!env["ANTHROPIC_API_KEY"]
	const [anthropicBaseUrlSelected, setAnthropicBaseUrlSelected] = useState(!!apiConfiguration?.anthropicBaseUrl)
	const [useApiKeyEnvVar, setUseApiKeyEnvVar] = useState(!!apiConfiguration?.anthropicApiKeyUseEnvVar)

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

	const handleUseApiKeyEnvVarChange = (checked: boolean) => {
		setUseApiKeyEnvVar(checked)
		setApiConfigurationField("anthropicApiKeyUseEnvVar", checked)
	}

	console.log("Environment from ApiOptions at Anthropic:", env)

	return (
		<>
			<VSCodeTextField
				value={env["ANTHROPIC_API_KEY"]}
				type="text"
				onInput={handleInputChange("apiKey")}
				placeholder={t("settings:placeholders.apiKey")}
				className="w-full"
				disabled={useApiKeyEnvVar}
				>
				<label className="block font-medium mb-1">{t("settings:providers.anthropicApiKey")}</label>
			</VSCodeTextField>
			<div className="text-sm text-vscode-descriptionForeground -mt-2">
				{t("settings:providers.apiKeyStorageNotice")}
			</div>
			<Checkbox
				checked={useApiKeyEnvVar}
				onChange={handleUseApiKeyEnvVarChange}
				className="mb-2"
				disabled={!apiKeyEnvVarExists}>
				{t("settings:providers.apiKeyUseEnvVar", { name: "ANTHROPIC_API_KEY"})}
			</Checkbox>
			{(!(apiConfiguration?.apiKey || apiConfiguration?.anthropicApiKeyUseEnvVar)) && (
				<VSCodeButtonLink href="https://console.anthropic.com/settings/keys" appearance="secondary">
					{t("settings:providers.getAnthropicApiKey")}
				</VSCodeButtonLink>
			)}
			<div>
				<Checkbox
					checked={anthropicBaseUrlSelected}
					onChange={(checked: boolean) => {
						setAnthropicBaseUrlSelected(checked)

						if (!checked) {
							setApiConfigurationField("anthropicBaseUrl", "")
							setApiConfigurationField("anthropicUseAuthToken", false)
						}
					}}>
					{t("settings:providers.useCustomBaseUrl")}
				</Checkbox>
				{anthropicBaseUrlSelected && (
					<>
						<VSCodeTextField
							value={apiConfiguration?.anthropicBaseUrl || ""}
							type="url"
							onInput={handleInputChange("anthropicBaseUrl")}
							placeholder="https://api.anthropic.com"
							className="w-full mt-1"
						/>
						<Checkbox
							checked={apiConfiguration?.anthropicUseAuthToken ?? false}
							onChange={handleInputChange("anthropicUseAuthToken", noTransform)}
							className="w-full mt-1">
							{t("settings:providers.anthropicUseAuthToken")}
						</Checkbox>
					</>
				)}
			</div>
		</>
	)
}
