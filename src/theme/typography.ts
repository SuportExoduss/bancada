import { Platform, type TextStyle } from 'react-native';

/**
 * Tipografia.
 *
 * Fonte do sistema por enquanto: é a que carrega instantâneo e a que o
 * usuário já enxerga bem. Fonte própria entra quando houver motivo de marca,
 * não antes — fonte custa download e atrasa o primeiro desenho.
 */
const family = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const familyBold = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const typography = {
  /** Números grandes: placar, XP */
  display: {
    fontFamily: familyBold,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: familyBold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: familyBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontFamily: family,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: familyBold,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  caption: {
    fontFamily: family,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  /** Do logo: "CONECTA · ORGANIZA · TRANSFORMA" */
  overline: {
    fontFamily: familyBold,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: familyBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
} satisfies Record<string, TextStyle>;

export type TypographyName = keyof typeof typography;
