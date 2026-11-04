import React, { forwardRef, useMemo, useSyncExternalStore } from "react";
import { Text as NativeText, TextInput as NativeTextInput, type TextProps, type TextInputProps } from "react-native";
import { useLang } from "./LanguageContext";
import { tr, subscribeAutoTranslate, getAutoTranslateVersion } from "./autoTranslate";

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
