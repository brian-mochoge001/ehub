import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { User, LogOut, ChevronRight, CreditCard, MapPin, Moon, Bell, Shield, BadgeQuestionMark, Info, Globe, LogIn } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession, signOut } from '@/services/auth-client';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === 'dark');

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const SettingItem = ({ icon: Icon, label, value, onPress, showArrow = true, color = Colors[colorScheme].text }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]} 
      onPress={onPress}
      disabled={!session && (label === 'Personal Information' || label === 'Payment Methods' || label === 'Saved Addresses')}
    >
      <View style={styles.settingLabelContainer}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
        <ThemedText style={[styles.settingLabel, !session && (label === 'Personal Information' || label === 'Payment Methods' || label === 'Saved Addresses') && { opacity: 0.3 }]}>
          {label}
        </ThemedText>
      </View>
      <View style={styles.settingValueContainer}>
        {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
        {showArrow && <ChevronRight size={18} color="#888" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={{ color: Colors[colorScheme].text, fontSize: 29, fontWeight: 'bold' }} type="title">Settings</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        {isPending ? (
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} style={{ marginVertical: 20 }} />
        ) : session ? (
          <View style={[styles.profileCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
            <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
              <User size={40} color={Colors[colorScheme].tint} />
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText type="subtitle">{session.user.name}</ThemedText>
              <ThemedText style={styles.profileEmail}>{session.user.email}</ThemedText>
            </View>
            <TouchableOpacity style={[styles.editBtn, { borderColor: Colors[colorScheme].tint }]}>
              <ThemedText style={{ color: Colors[colorScheme].tint, fontSize: 12, fontWeight: 'bold' }}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.profileCard, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222', justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.avatar, { backgroundColor: '#88820' }]}>
                <User size={40} color="#888" />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText type="subtitle">Guest User</ThemedText>
                <ThemedText style={styles.profileEmail}>Sign in to access your profile</ThemedText>
                <TouchableOpacity 
                  style={[styles.loginBtn, { backgroundColor: Colors[colorScheme].tint }]}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Sign In</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Account Section */}
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        <SettingItem icon={User} label="Personal Information" />
        <SettingItem icon={CreditCard} label="Payment Methods" value={session ? "Visa **** 4242" : undefined} />
        <SettingItem icon={MapPin} label="Saved Addresses" />

        {/* App Settings */}
        <ThemedText style={styles.sectionTitle}>App Settings</ThemedText>
        <View style={[styles.settingItem, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]}>
          <View style={styles.settingLabelContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#FF980015' }]}>
              <Moon size={20} color="#FF9800" />
            </View>
            <ThemedText style={styles.settingLabel}>Dark Mode</ThemedText>
          </View>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ true: Colors[colorScheme].tint }} />
        </View>
        <SettingItem icon={Bell} label="Notifications" color="#4CAF50" />
        <SettingItem icon={Globe} label="Language" value="English" color="#2196F3" />
        <SettingItem icon={Shield} label="Privacy & Security" color="#F44336" />

        {/* Support */}
        <ThemedText style={styles.sectionTitle}>Support</ThemedText>
        <SettingItem icon={BadgeQuestionMark} label="Help Center" color="#9C27B0" />
        <SettingItem icon={Info} label="About eHub" color="#607D8B" />

        {/* Auth Action */}
        {session ? (
          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]} onPress={handleLogout}>
            <LogOut size={20} color="#FF6347" />
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.logoutBtn, { backgroundColor: colorScheme === 'light' ? '#fff' : '#222' }]} 
            onPress={() => router.push('/(auth)/login')}
          >
            <LogIn size={20} color={Colors[colorScheme].tint} />
            <ThemedText style={[styles.logoutText, { color: Colors[colorScheme].tint }]}>Sign In</ThemedText>
          </TouchableOpacity>
        )}

        <ThemedText style={styles.versionText}>Version 1.0.0 (Build 123)</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { marginBottom: 20, paddingHorizontal: 20 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 25, marginBottom: 25, elevation: 2, shadowOpacity: 0.05, shadowRadius: 5 },
  avatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: 15 },
  profileEmail: { fontSize: 13, opacity: 0.5, marginTop: 2 },
  editBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  loginBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', opacity: 0.4, marginBottom: 10, marginLeft: 10, marginTop: 5 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 18, marginBottom: 8, elevation: 1, shadowOpacity: 0.02, shadowRadius: 2 },
  settingLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingValueContainer: { flexDirection: 'row', alignItems: 'center' },
  settingValue: { fontSize: 14, color: '#888', marginRight: 8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 18, marginTop: 20, elevation: 1 },
  logoutText: { marginLeft: 10, color: '#FF6347', fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', marginTop: 25, fontSize: 12, opacity: 0.3 },
});
