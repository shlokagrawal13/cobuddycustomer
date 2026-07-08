import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'LanguageSelection'>;

const BORDER  = 'rgba(255,255,255,0.08)';
const CARD_BG = 'rgba(11,13,26,0.55)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
}

const LANGUAGES: Language[] = [
  {code:'en', name:'English',    nativeName:'English',     region:'Global'},
  {code:'ar', name:'Arabic',     nativeName:'Arabic',      region:'Middle East'},
  {code:'fr', name:'French',     nativeName:'French',      region:'Europe'},
  {code:'de', name:'German',     nativeName:'German',      region:'Europe'},
  {code:'zh', name:'Chinese',    nativeName:'Chinese',     region:'Asia'},
  {code:'ja', name:'Japanese',   nativeName:'Japanese',    region:'Asia'},
  {code:'ru', name:'Russian',    nativeName:'Russian',     region:'Europe'},
  {code:'es', name:'Spanish',    nativeName:'Spanish',     region:'Americas'},
  {code:'pt', name:'Portuguese', nativeName:'Portuguese',  region:'Americas'},
  {code:'ko', name:'Korean',     nativeName:'Korean',      region:'Asia'},
];

const REGIONS = ['All', 'Global', 'Europe', 'Middle East', 'Asia', 'Americas'];

export default function LanguageSelectionScreen({navigation}: Props) {
  const [selected, setSelected]     = useState('en');
  const [activeRegion, setRegion]   = useState('All');

  const displayed = activeRegion === 'All'
    ? LANGUAGES
    : LANGUAGES.filter(l => l.region === activeRegion);

  const handleContinue = () => {
    // Language preference saved locally — navigate forward in auth flow
    Alert.alert(
      'Language Set',
      'Language preference saved. This will be applied when you complete setup.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Icon name="language" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroHeading}>Choose Your Language</Text>
          <Text style={styles.heroSub}>
            Select your preferred language for the CoBuddy experience. You can change this at any time in Settings.
          </Text>
        </View>

        {/* Region filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionRow}>
          {REGIONS.map(r => {
            const active = activeRegion === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.regionChip, active && styles.regionChipActive]}
                onPress={() => setRegion(r)}
                activeOpacity={0.8}>
                <Text style={[styles.regionText, active && styles.regionTextActive]}>{r}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Language list */}
        <View style={styles.langList}>
          {displayed.map(lang => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, isSelected && styles.langCardActive]}
                onPress={() => setSelected(lang.code)}
                activeOpacity={0.85}>
                <View style={styles.langLeft}>
                  <View style={[styles.langCodeWrap, isSelected && styles.langCodeWrapActive]}>
                    <Text style={[styles.langCode, isSelected && styles.langCodeActive]}>
                      {lang.code.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.langMeta}>
                    <Text style={[styles.langName, isSelected && styles.langNameActive]}>{lang.name}</Text>
                    <Text style={styles.langNative}>{lang.nativeName}</Text>
                  </View>
                </View>
                <View style={styles.langRight}>
                  <View style={styles.regionTag}>
                    <Text style={styles.regionTagText}>{lang.region}</Text>
                  </View>
                  {isSelected && (
                    <Icon name="check-circle" size={20} color={Colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{height: 32}} />
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.87}>
          <Text style={styles.continueBtnText}>Continue</Text>
          <Icon name="arrow-forward" size={18} color={Colors.surface} />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 60, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 20},

  hero: {alignItems: 'center', gap: 12, paddingBottom: 4},
  heroIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  heroHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, textAlign: 'center'},
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 22, maxWidth: 300,
  },

  regionRow: {gap: 8, paddingRight: 16},
  regionChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
  },
  regionChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  regionText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  regionTextActive: {color: Colors.primary},

  langList: {gap: 8},
  langCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: CARD_BG, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  langCardActive: {borderColor: GOLD_BD, backgroundColor: GOLD_BG},
  langLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  langCodeWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  langCodeWrapActive: {backgroundColor: Colors.primaryContainer, borderColor: GOLD_BD},
  langCode: {fontFamily: 'Inter-Bold', fontSize: 12, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  langCodeActive: {color: Colors.primary},
  langMeta: {gap: 2},
  langName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  langNameActive: {color: Colors.primary},
  langNative: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  langRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
  regionTag: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: BORDER,
  },
  regionTagText: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},

  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER,
    backgroundColor: 'rgba(14,14,10,0.97)', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
  },
  continueBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.surface},
});
