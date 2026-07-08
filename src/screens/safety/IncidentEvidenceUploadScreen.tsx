import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'IncidentEvidenceUpload'>;

type EvidenceType = 'photo' | 'video' | 'audio' | 'document';

interface EvidenceItem {
  id: string;
  type: EvidenceType;
  name: string;
  size: string;
  uploaded: boolean;
}

const TYPE_ICONS: Record<EvidenceType, string> = {
  photo:    'photo',
  video:    'videocam',
  audio:    'mic',
  document: 'description',
};

const TYPE_LABELS: Record<EvidenceType, string> = {
  photo:    'Photo',
  video:    'Video',
  audio:    'Audio Note',
  document: 'Document',
};

const MOCK_UPLOADED: EvidenceItem[] = [
  {id: 'e1', type: 'photo',    name: 'screenshot_2026.jpg',  size: '1.2 MB', uploaded: true},
  {id: 'e2', type: 'document', name: 'email_exchange.pdf',   size: '480 KB', uploaded: true},
];

export default function IncidentEvidenceUploadScreen({navigation, route}: Props) {
  const reportId = route.params?.reportId;
  const [selectedType, setSelectedType] = useState<EvidenceType>('photo');
  const [uploaded, setUploaded] = useState<EvidenceItem[]>(MOCK_UPLOADED);

  const handleAddEvidence = () => {
    Alert.alert(
      'Add Evidence',
      `Adding ${TYPE_LABELS[selectedType]} evidence:\n\nCamera, microphone, and file system access will be available when native permissions are connected to the incident reporting pipeline.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Simulate Upload',
          onPress: () => {
            const mock: EvidenceItem = {
              id: `e_${Date.now()}`,
              type: selectedType,
              name: `evidence_${Date.now()}.${selectedType === 'document' ? 'pdf' : selectedType === 'audio' ? 'm4a' : selectedType === 'video' ? 'mp4' : 'jpg'}`,
              size: '0.8 MB',
              uploaded: true,
            };
            setUploaded(prev => [...prev, mock]);
          },
        },
      ],
    );
  };

  const handleRemoveEvidence = (id: string, name: string) => {
    Alert.alert('Remove Evidence', `Remove "${name}" from this report?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Remove', style: 'destructive', onPress: () => setUploaded(prev => prev.filter(e => e.id !== id))},
    ]);
  };

  const handleSaveEvidence = () => {
    if (uploaded.length === 0) {
      Alert.alert('No Evidence', 'Please add at least one piece of evidence before saving.');
      return;
    }
    Alert.alert(
      'Evidence Saved',
      `${uploaded.length} item${uploaded.length > 1 ? 's' : ''} ${uploaded.length > 1 ? 'have' : 'has'} been attached to your incident report. All evidence will be securely transmitted when the report API is connected.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Evidence</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Report summary */}
        <View style={styles.reportSummary}>
          <Icon name="report" size={18} color={Colors.error} />
          <View style={styles.reportSummaryMeta}>
            <Text style={styles.reportSummaryTitle}>Incident Report</Text>
            <Text style={styles.reportSummaryId}>{reportId ? `#${reportId}` : 'Draft Report'}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>PENDING</Text>
          </View>
        </View>

        {/* Evidence type chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EVIDENCE TYPE</Text>
          <View style={styles.typeChips}>
            {(['photo','video','audio','document'] as EvidenceType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, selectedType === t && styles.typeChipActive]}
                onPress={() => setSelectedType(t)}
                activeOpacity={0.8}>
                <Icon name={TYPE_ICONS[t]} size={16} color={selectedType === t ? Colors.onPrimary : Colors.onSurfaceVariant} />
                <Text style={[styles.typeChipText, selectedType === t && styles.typeChipTextActive]}>
                  {TYPE_LABELS[t]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upload area */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.uploadArea} onPress={handleAddEvidence} activeOpacity={0.8}>
            <View style={styles.uploadAreaIcon}>
              <Icon name={TYPE_ICONS[selectedType]} size={32} color={Colors.primary} />
            </View>
            <Text style={styles.uploadAreaTitle}>Add {TYPE_LABELS[selectedType]}</Text>
            <Text style={styles.uploadAreaSub}>
              {selectedType === 'photo'    ? 'JPG or PNG, up to 10 MB each' :
               selectedType === 'video'   ? 'MP4 or MOV, up to 50 MB each' :
               selectedType === 'audio'   ? 'M4A or MP3, up to 20 MB each' :
               'PDF, DOCX, or XLSX, up to 20 MB each'}
            </Text>
            <View style={styles.uploadBtn}>
              <Icon name="add" size={16} color={Colors.onPrimary} />
              <Text style={styles.uploadBtnText}>Tap to Add</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Uploaded items */}
        {uploaded.length > 0 && (
          <View style={styles.section}>
            <View style={styles.uploadedHeader}>
              <Text style={styles.sectionTitle}>ATTACHED EVIDENCE</Text>
              <Text style={styles.uploadedCount}>{uploaded.length} file{uploaded.length > 1 ? 's' : ''}</Text>
            </View>
            {uploaded.map(item => (
              <View key={item.id} style={styles.evidenceItem}>
                <View style={styles.evidenceIconWrap}>
                  <Icon name={TYPE_ICONS[item.type]} size={18} color={Colors.primary} />
                </View>
                <View style={styles.evidenceMeta}>
                  <Text style={styles.evidenceName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.evidenceSize}>{TYPE_LABELS[item.type]}  •  {item.size}</Text>
                </View>
                <View style={styles.evidenceStatus}>
                  <Icon name="check-circle" size={16} color={Colors.success} />
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveEvidence(item.id, item.name)}
                  activeOpacity={0.7}
                  style={styles.evidenceRemove}>
                  <Icon name="close" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Icon name="lock" size={16} color={Colors.primary} />
          <Text style={styles.privacyNoteText}>
            All evidence is end-to-end encrypted and accessible only to the CoBuddy Trust & Safety team. It will not be shared without your consent.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSaveEvidence} activeOpacity={0.87}>
          <Icon name="cloud-upload" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>
            Save Evidence ({uploaded.length} {uploaded.length === 1 ? 'file' : 'files'})
          </Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        {flex: 1, backgroundColor: Colors.surface},
  header:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:          {padding: 4},
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  reportSummary:    {flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant},
  reportSummaryMeta:{flex: 1},
  reportSummaryTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  reportSummaryId:  {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  pendingBadge:     {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: Colors.outlineVariant},
  pendingBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 0.8},
  section:          {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  typeChips:        {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  typeChip:         {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  typeChipActive:   {borderColor: Colors.primary, backgroundColor: Colors.primary},
  typeChipText:     {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant},
  typeChipTextActive: {color: Colors.onPrimary},
  uploadArea:       {alignItems: 'center', justifyContent: 'center', paddingVertical: 32, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.primary, backgroundColor: Colors.primaryContainer, gap: 10},
  uploadAreaIcon:   {width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center'},
  uploadAreaTitle:  {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  uploadAreaSub:    {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  uploadBtn:        {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.primary, marginTop: 4},
  uploadBtnText:    {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},
  uploadedHeader:   {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  uploadedCount:    {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  evidenceItem:     {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: 8},
  evidenceIconWrap: {width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center'},
  evidenceMeta:     {flex: 1},
  evidenceName:     {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  evidenceSize:     {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  evidenceStatus:   {paddingHorizontal: 4},
  evidenceRemove:   {padding: 4},
  privacyNote:      {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 24, padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  privacyNoteText:  {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  ctaBtn:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:       {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
