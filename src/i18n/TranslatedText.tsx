import React, { forwardRef, useMemo, useSyncExternalStore } from "react";
import { Text as NativeText, TextInput as NativeTextInput, type TextProps, type TextInputProps } from "react-native";
import { useLang } from "./LanguageContext";
import { tr, trName, subscribeAutoTranslate, getAutoTranslateVersion } from "./autoTranslate";

function translateNode(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") return tr(node);
  if (Array.isArray(node)) return node.map((child, index) => <React.Fragment key={index}>{translateNode(child)}</React.Fragment>);
  // Nested Text elements are translated by their own TranslatedText wrapper.
  return node;
}

export type TranslatedText = NativeText;
export const TranslatedText = forwardRef<NativeText, TextProps>(function TranslatedText(
  { children, ...props }, ref
) {
  const { lang } = useLang();
  // The version changes when an async server translation arrives. It MUST be a
  // memo dependency, otherwise React re-renders but keeps the old English child.
  const translationVersion = useSyncExternalStore(
    subscribeAutoTranslate,
    getAutoTranslateVersion,
    getAutoTranslateVersion
  );
  const translated = useMemo(
    () => translateNode(children),
    [children, lang, translationVersion]
  );
  const translatedProps = useMemo(() => ({
    ...props,
    accessibilityLabel: props.accessibilityLabel ? tr(props.accessibilityLabel) : props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint ? tr(props.accessibilityHint) : props.accessibilityHint,
  }), [props, lang, translationVersion]);
  return <NativeText ref={ref} {...translatedProps}>{translated}</NativeText>;
});

export type TranslatedTextInput = NativeTextInput;
export const TranslatedTextInput = forwardRef<NativeTextInput, TextInputProps>(function TranslatedTextInput(
  { placeholder, ...props }, ref
) {
  const { lang } = useLang();
  const translationVersion = useSyncExternalStore(
    subscribeAutoTranslate,
    getAutoTranslateVersion,
    getAutoTranslateVersion
  );
  const translatedPlaceholder = useMemo(
    () => placeholder ? tr(placeholder) : placeholder,
    [placeholder, lang, translationVersion]
  );
  const translatedProps = useMemo(() => ({
    ...props,
    accessibilityLabel: props.accessibilityLabel ? tr(props.accessibilityLabel) : props.accessibilityLabel,
    accessibilityHint: props.accessibilityHint ? tr(props.accessibilityHint) : props.accessibilityHint,
  }), [props, lang, translationVersion]);
  return <NativeTextInput ref={ref} {...translatedProps} placeholder={translatedPlaceholder} />;
});

/**
 * A sentence that contains the pet's name. `template` is written with the sample name ("Milo"), exactly like the
 * guide texts, so one translated sentence serves every pet. When there is no pet name, pass the plain
 * "your pet" sentence as `template` and leave `name` empty.
 */
export const TranslatedNameText = forwardRef<NativeText, TextProps & { template: string; name?: string }>(function TranslatedNameText(
  { template, name, ...props }, ref
) {
  const { lang } = useLang();
  const translationVersion = useSyncExternalStore(
    subscribeAutoTranslate,
    getAutoTranslateVersion,
    getAutoTranslateVersion
  );
  const text = useMemo(
    /* No pet name yet: use the "your pet" twin of the sentence (it is translated too). */
    () => (name ? trName(template, name) : tr(template.replace(/\bMilo\b/g, "your pet"))),
    [template, name, lang, translationVersion]
  );
  return <NativeText ref={ref} {...props}>{text}</NativeText>;
});
