import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SupabaseClient } from '@supabase/supabase-js';
import { DEFAULT_CHECKIN_TEMPLATES } from '@trackme/shared';

interface CheckInScreenProps {
  navigation: any;
  supabase: SupabaseClient;
  session: any;
}

export function CheckInScreen({ navigation, supabase, session }: CheckInScreenProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);

  const templates = DEFAULT_CHECKIN_TEMPLATES.filter((t) => t.is_frequent);

  const handleSubmit = async () => {
    const activityName = customActivity || selectedTemplate;
    if (!activityName) {
      Alert.alert('Error', 'Please select or enter an activity');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    setLoading(true);

    try {
      const template = templates.find((t) => t.name === activityName);
      const now = new Date();
      const startTime = new Date(now.getTime() - durationNum * 60 * 1000);

      await supabase.from('manual_checkins').insert({
        user_id: session.user.id,
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        duration_minutes: durationNum,
        activity_type: activityName,
        activity_description: customActivity || null,
        category: template?.category || 'Other',
        productivity_score: template?.productivity_score || 50,
        is_meeting: activityName.toLowerCase().includes('meeting'),
        triggered_by: 'manual',
        device_was_idle: false,
        prompt_time: now.toISOString(),
        response_time: now.toISOString(),
      });

      Alert.alert('Success', 'Activity logged successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Activity</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Select</Text>
        <View style={styles.templatesGrid}>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.name}
              style={[
                styles.templateButton,
                selectedTemplate === template.name && styles.templateButtonActive,
              ]}
              onPress={() => {
                setSelectedTemplate(template.name);
                setCustomActivity('');
                setDuration(template.default_duration.toString());
              }}
            >
              <Text style={styles.templateEmoji}>{template.emoji}</Text>
              <Text style={styles.templateName}>{template.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Or Type Activity</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Client meeting, Research..."
          value={customActivity}
          onChangeText={(text) => {
            setCustomActivity(text);
            setSelectedTemplate('');
          }}
          editable={!loading}
        />

        <Text style={styles.sectionTitle}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="30"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : 'Log Activity'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  templateButton: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  templateButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  templateEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  templateName: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
