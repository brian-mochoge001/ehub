import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { ArrowLeft, Briefcase, MapPin, X, Building } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function JobsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#0066FF';
  const isDark = colorScheme === 'dark';

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
        setLoading(true);
        const data = await api.getJobs();
        setJobs(data || []);
    } catch (err) {
        console.error('Failed to fetch jobs:', err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={activeColor} />
        </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><ArrowLeft size={24} color={Colors[colorScheme].text} /></TouchableOpacity>
        <ThemedText type="subtitle">Find your dream job</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {jobs.map(job => (
          <TouchableOpacity key={job.id} style={[styles.jobCard, { backgroundColor: isDark ? '#222' : '#fff' }]} onPress={() => setSelectedJob(job)}>
            <View style={styles.jobHeader}>
              <View style={styles.companyLogo}><Briefcase size={24} color={activeColor} /></View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <ThemedText type="defaultSemiBold">{job.title}</ThemedText>
                <ThemedText style={styles.companyName}>{job.business_name || 'Hiring Company'}</ThemedText>
              </View>
            </View>
            <View style={styles.jobFooter}>
                <ThemedText style={styles.salaryText}>{job.salary_range}</ThemedText>
                <ThemedText style={styles.locationText}><MapPin size={12}/> {job.location}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedJob} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedJob(null)}><X size={24}/></TouchableOpacity>
            <ThemedText type="title">{selectedJob?.title}</ThemedText>
            <TouchableOpacity style={styles.companyLink} onPress={() => router.push(`/miniservices/company-profile?id=${selectedJob?.business_id}` as any)}>
                <Building size={16} color={activeColor}/>
                <ThemedText style={{color: activeColor, marginLeft: 5}}>View Company Profile</ThemedText>
            </TouchableOpacity>
            <ScrollView style={{marginTop: 20}}>
                <ThemedText type="defaultSemiBold">Description</ThemedText>
                <ThemedText style={styles.modalText}>{selectedJob?.description}</ThemedText>
                <ThemedText type="defaultSemiBold" style={{marginTop: 15}}>Requirements</ThemedText>
                <ThemedText style={styles.modalText}>{selectedJob?.requirements}</ThemedText>
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40, paddingHorizontal: 20 },
  jobCard: { padding: 20, borderRadius: 25, marginBottom: 15, elevation: 2 },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  companyLogo: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(0, 102, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  companyName: { fontSize: 12, opacity: 0.5 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  salaryText: { fontSize: 14, fontWeight: 'bold' },
  locationText: { fontSize: 12, opacity: 0.6 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { height: '80%', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  closeBtn: { alignSelf: 'flex-end', padding: 10 },
  companyLink: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  modalText: { marginTop: 5, opacity: 0.8, lineHeight: 22 }
});
