import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { ArrowLeft, Search, Briefcase, Bookmark, Filter } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const JOB_CATEGORIES = [
  { id: '1', name: 'Design', icon: '🎨', jobs: '1.2k' },
  { id: '2', name: 'Tech', icon: '💻', jobs: '2.5k' },
  { id: '3', name: 'Sales', icon: '📈', jobs: '800' },
  { id: '4', name: 'Writing', icon: '✍️', jobs: '400' },
];

const RECOMMENDED_JOBS = [
  { id: '1', title: 'Product Designer', company: 'Google', location: 'Remote', salary: '$80k - $120k', type: 'Full-time', logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' },
  { id: '2', title: 'Senior Developer', company: 'Meta', location: 'Nairobi', salary: '$100k - $150k', type: 'Contract', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png' },
];

export default function JobsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = '#0066FF'; // Jobs blue
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ThemedText style={styles.welcomeText}>Hello, Candidate</ThemedText>
          <ThemedText type="defaultSemiBold">Find your dream job</ThemedText>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Bookmark size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
            <Search size={20} color="#888" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search job title, company..." 
              placeholderTextColor="#888"
              style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            />
          </View>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: activeColor }]}>
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Specialization</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {JOB_CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
              <ThemedText style={styles.catEmoji}>{cat.icon}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.catName}>{cat.name}</ThemedText>
              <ThemedText style={styles.catJobs}>{cat.jobs} Jobs</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Jobs */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recommended for you</ThemedText>
          <TouchableOpacity><ThemedText style={{ color: activeColor }}>See All</ThemedText></TouchableOpacity>
        </View>

        {RECOMMENDED_JOBS.map(job => (
          <TouchableOpacity key={job.id} style={[styles.jobCard, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <View style={styles.jobHeader}>
              <View style={styles.companyInfo}>
                <View style={styles.companyLogo}>
                  <Briefcase size={24} color={activeColor} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <ThemedText type="defaultSemiBold">{job.title}</ThemedText>
                  <ThemedText style={styles.companyName}>{job.company} • {job.location}</ThemedText>
                </View>
              </View>
              <TouchableOpacity>
                <Bookmark size={18} color="#888" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.jobFooter}>
              <View style={styles.jobBadges}>
                <View style={[styles.jobBadge, { backgroundColor: activeColor + '15' }]}>
                  <ThemedText style={[styles.badgeText, { color: activeColor }]}>{job.type}</ThemedText>
                </View>
                <View style={[styles.jobBadge, { backgroundColor: '#4CAF5015' }]}>
                  <ThemedText style={[styles.badgeText, { color: '#4CAF50' }]}>Design</ThemedText>
                </View>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.salaryText}>{job.salary}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}

        {/* CV Promo */}
        <View style={[styles.cvCard, { backgroundColor: activeColor }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.cvTitle}>Improve your profile!</ThemedText>
            <ThemedText style={styles.cvSubtitle}>Complete your CV to get matched with 3x more employers.</ThemedText>
            <TouchableOpacity style={styles.cvBtn}>
              <ThemedText style={{ color: activeColor, fontWeight: 'bold' }}>Complete Now</ThemedText>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400' }} 
            style={styles.cvImage}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  headerCenter: { flex: 1, marginLeft: 15 },
  welcomeText: { fontSize: 12, opacity: 0.5 },
  iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  scrollContent: { paddingBottom: 40 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 25 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  filterBtn: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  catList: { paddingLeft: 20, paddingRight: 10, marginBottom: 25 },
  catCard: { width: 100, padding: 15, borderRadius: 20, marginRight: 15, alignItems: 'center', elevation: 1, shadowOpacity: 0.02 },
  catEmoji: { fontSize: 24, marginBottom: 10 },
  catName: { fontSize: 13, marginBottom: 4 },
  catJobs: { fontSize: 11, opacity: 0.5 },
  jobCard: { marginHorizontal: 20, padding: 20, borderRadius: 25, marginBottom: 15, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  companyInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  companyLogo: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(0, 102, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  companyName: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobBadges: { flexDirection: 'row', gap: 8 },
  jobBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  salaryText: { fontSize: 14 },
  cvCard: { marginHorizontal: 20, borderRadius: 25, padding: 20, flexDirection: 'row', overflow: 'hidden', marginTop: 10 },
  cvTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cvSubtitle: { color: '#fff', fontSize: 12, opacity: 0.8, marginVertical: 12 },
  cvBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  cvImage: { width: 100, height: 100, position: 'absolute', right: -10, bottom: -10, opacity: 0.5 },
});
