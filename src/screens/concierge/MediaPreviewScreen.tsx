import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ConciergeStackParamList, 'MediaPreview'>;

const FILE_TYPE_ICONS: Record<string, string> = {
  image:    'photo',
  video:    'videocam',
  audio:    'mic',
  document: 'description',
};

const MOCK_MEDIA = {
  uri:         '',          // production: real file URI
  type:        'image' as const,
  name:        'shared_image_2026.jpg',
  size:        '1.4 MB',
  uploaded:    'Just now',
  conversationId: 'concierge_main',
};

export default function MediaPreviewScreen({navigation, route}: Props) {
  const {uri, conversationId} = route.params;
  void uri;

  const media = MOCK_MEDIA;
  const [caption, setCaption] = useState('');

  const handleSend = () => {
    Alert.alert(
      'Sent Securely',
      `"${media.name}" ${caption ? `with caption "${caption}" ` : ''}will be sent to conversation ${conversationId ?? media.conversationId} when the secure file transfer API is connected.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Attachment',
      'Remove this file and go back to the media picker?',
      [
        {text: 'Keep', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <TouchableOpacity onPress={handleRemove} activeOpacity={0.7} style={styles.removeBtn}>
          <Icon name="delete-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Media preview placeholder */}
          <View style={styles.previewZone}>
            <View style={styles.previewPlaceholder}>
              <View style={styles.previewIconRing}>
                <Icon name={FILE_TYPE_ICONS[media.type]} size={48} color={Colors.primary} />
              </View>
              <Text style={styles.previewTypeLbl}>{media.type.toUpperCase()}</Text>
              <Text style={styles.previewHint}>
                {media.type === 'image' || media.type === 'video'
                  ? 'Native image/video renderer will display here when connected to the file system.'
                  : 'Document preview will render here when connected to the native file viewer.'}
              </Text>
            </View>

            {/* Encrypt badge */}
            <View style={styles.encryptBadge}>
              <Icon name="lock" size={12} color={Colors.primary} />
              <Text style={styles.encryptBadgeText}>End-to-end encrypted</Text>
            </View>
          </View>

          {/* File details */}
          <View style={styles.fileCard}>
            <Text style={styles.fileCardTitle}>FILE DETAILS</Text>
            {([
              {icon: 'description',  label: 'File Name',  value: media.name},
              {icon: 'storage',      label: 'File Size',  value: media.size},
              {icon: 'schedule',     label: 'Added',      value: media.uploaded},
              {icon: 'chat',         label: 'Send To',    value: `Conversation ${conversationId ?? media.conversationId}`},
            ] as const).map(row => (
              <View key={row.label} style={styles.fileRow}>
                <Icon name={row.icon} size={14} color={Colors.primary} />
                <Text style={styles.fileRowLabel}>{row.label}</Text>
                <Text style={styles.fileRowValue} numberOfLines={1}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Caption input */}
          <View style={styles.captionSection}>
            <Text style={styles.captionLabel}>ADD A CAPTION (OPTIONAL)</Text>
            <TextInput
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
              placeholder="Add a message with this attachment..."
              placeholderTextColor={Colors.outlineVariant}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.charCount}>{caption.length}/200</Text>
          </View>

          {/* Privacy note */}
          <View style={styles.privacyNote}>
            <Icon name="verified-user" size={15} color={Colors.primary} />
            <Text style={styles.privacyNoteText}>
              All attachments are encrypted in transit and at rest. Media is never stored on third-party servers without your consent.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.removeActionBtn} onPress={handleRemove} activeOpacity={0.8}>
              <Icon name="delete-outline" size={18} color={Colors.error} />
              <Text style={styles.removeActionText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.87}>
              <Icon name="send" size={18} color={Colors.onPrimary} />
              <Text style={styles.sendBtnText}>Send Securely</Text>
            </TouchableOpacity>
          </View>

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        {flex: 1, backgroundColor: Colors.surface},
  header:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:          {padding: 4},
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  removeBtn:        {padding: 4},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  previewZone:      {marginHorizontal: 20, marginTop: 20},
  previewPlaceholder: {alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, borderStyle: 'dashed'},
  previewIconRing:  {width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: Colors.primary},
  previewTypeLbl:   {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, letterSpacing: 2, marginBottom: 10},
  previewHint:      {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.outlineVariant, textAlign: 'center', paddingHorizontal: 24, lineHeight: 18},
  encryptBadge:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 7, paddingHorizontal: 14, alignSelf: 'center', borderRadius: 20, backgroundColor: Colors.primaryContainer, borderWidth: 1, borderColor: Colors.primary},
  encryptBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},
  fileCard:         {marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  fileCardTitle:    {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  fileRow:          {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  fileRowLabel:     {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, width: 72},
  fileRowValue:     {flex: 1, fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},
  captionSection:   {paddingHorizontal: 20, paddingTop: 20},
  captionLabel:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 10},
  captionInput:     {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface, textAlignVertical: 'top', minHeight: 75},
  charCount:        {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.outlineVariant, textAlign: 'right', marginTop: 4},
  privacyNote:      {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, padding: 12, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  privacyNoteText:  {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  actionRow:        {flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 20},
  removeActionBtn:  {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.error},
  removeActionText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error},
  sendBtn:          {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  sendBtnText:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
