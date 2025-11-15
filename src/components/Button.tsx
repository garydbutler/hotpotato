import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle: ViewStyle = {
    ...styles.base,
    ...styles[variant],
    ...styles[`${size}Size`],
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
    ...(StyleSheet.flatten(style) as ViewStyle),
  };

  const textStyle: TextStyle = {
    ...styles.text,
    ...styles[`${variant}Text`],
    ...styles[`${size}Text`],
    ...(disabled && styles.disabledText),
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary : theme.colors.text.inverse}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    ...theme.shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  smallSize: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  mediumSize: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 44,
  },
  largeSize: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  primaryText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
  },
  secondaryText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
  },
  outlineText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
  },
  smallText: {
    fontSize: theme.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.base,
  },
  largeText: {
    fontSize: theme.typography.fontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
});
