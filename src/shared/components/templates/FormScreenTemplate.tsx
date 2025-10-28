import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { SectionHeader } from '../molecules/SectionHeader';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

/**
 * FormScreenTemplate
 * 
 * Reusable template for form screens with common features:
 * - Form field rendering
 * - Validation error display
 * - Submit/cancel buttons
 * - Keyboard-aware scroll view
 * - Loading states
 * 
 * @example
 * ```tsx
 * <FormScreenTemplate
 *   title="Create Team"
 *   fields={[
 *     { name: 'name', label: 'Team Name', type: 'text', required: true },
 *     { name: 'sport', label: 'Sport', type: 'select', options: sports },
 *   ]}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   isLoading={isSubmitting}
 * />
 * ```
 */

export interface FormField {
  /** Field name/key */
  name: string;
  /** Field label */
  label: string;
  /** Input type */
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date';
  /** Placeholder text */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Default value */
  defaultValue?: string;
  /** Select options (for type='select') */
  options?: Array<{ label: string; value: string }>;
  /** Validation rules */
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface FormScreenTemplateProps {
  /** Screen title */
  title: string;
  /** Form fields configuration */
  fields: FormField[];
  /** Submit callback */
  onSubmit: (data: Record<string, any>) => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button label */
  submitLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Validation errors */
  validationErrors?: Record<string, string>;
  /** Additional content to render */
  children?: React.ReactNode;
}

export const FormScreenTemplate: React.FC<FormScreenTemplateProps> = ({
  title,
  fields,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  validationErrors = {},
  children,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue || '';
    });
    return initialData;
  });

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const error = validationErrors[field.name];
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Input
              label={field.label}
              value={value}
              onChangeText={(text) => handleFieldChange(field.name, text)}
              placeholder={field.placeholder}
              secureTextEntry={field.type === 'password'}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'number' ? 'numeric' : 'default'}
              error={error}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Input
              label={field.label}
              value={value}
              onChangeText={(text) => handleFieldChange(field.name, text)}
              placeholder={field.placeholder}
              multiline
              numberOfLines={4}
              error={error}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );

      // Add more field types as needed (select, date, etc.)
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <SectionHeader title={title} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {fields.map(renderField)}
        
        {children}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {onCancel && (
          <Button
            label={cancelLabel}
            onPress={onCancel}
            variant="secondary"
            disabled={isLoading}
            style={styles.button}
          />
        )}
        
        <Button
          label={isLoading ? 'Submitting...' : submitLabel}
          onPress={handleSubmit}
          variant="primary"
          disabled={isLoading}
          style={styles.button}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
