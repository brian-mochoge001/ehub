import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, Alert, TextInput, TouchableOpacity, Image, Switch, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Using @react-native-picker/picker for dropdowns
import { ArrowLeft, Camera, ImagePlus, Tag, DollarSign, ClipboardList, Wrench, Package, List, AlignLeft, Info as InfoIcon, Globe, Cross } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Mock Data for Categories and Brands
const MOCK_CATEGORIES = [
  { id: 'cat1', name: 'Electronics', subCategories: ['Smartphones', 'Laptops', 'Cameras', 'Accessories'] },
  { id: 'cat2', name: 'Fashion', subCategories: ['Apparel', 'Footwear', 'Jewelry'] },
  { id: 'cat3', name: 'Home & Garden', subCategories: ['Furniture', 'Decor', 'Tools'] },
  { id: 'cat4', name: 'Vehicles', subCategories: ['Cars', 'Motorcycles', 'Bicycles'] },
];

const MOCK_BRANDS = [
  { id: 'br1', name: 'Apple' }, { id: 'br2', name: 'Samsung' }, { id: 'br3', name: 'Sony' },
  { id: 'br4', name: 'Nike' }, { id: 'br5', name: 'Adidas' }, { id: 'br6', name: 'IKEA' },
];

const MOCK_CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts or Not Working'];

export default function NewC2CListingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tint;
  const isDark = colorScheme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]); // To store local URIs of selected images
  const [location, setLocation] = useState('');

  const availableSubCategories = MOCK_CATEGORIES.find(cat => cat.id === category)?.subCategories || [];

  const handleImageUpload = () => {
    // Simulate image picking
    if (imageUris.length < 3) {
      const newUri = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`; // Mock image
      setImageUris([...imageUris, newUri]);
    } else {
      Alert.alert('Image Limit', 'You can upload a maximum of 3 images.');
    }
  };

  const handleSubmit = () => {
    // Here, you would typically send this data to your backend API
    const formData = {
      title,
      description,
      price: parseFloat(price),
      category,
      subCategory,
      brand,
      condition,
      isNegotiable,
      imageUris,
      location,
    };
    console.log('C2C Listing Data:', formData);
    Alert.alert('Listing Submitted', 'Your item has been listed successfully! (Simulated)');
    router.back(); // Navigate back after submission
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.screenTitle}>List New Item</ThemedText>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Title */}
        <ThemedText style={styles.label}>Item Title</ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
          placeholder="e.g., iPhone 13 Pro Max"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        {/* Category */}
        <ThemedText style={styles.label}>Category</ThemedText>
        <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].card }]}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => {
              setCategory(itemValue);
              setSubCategory(''); // Reset sub-category when main category changes
              setBrand(''); // Reset brand as well
            }}
            style={styles.picker}
            itemStyle={{ color: Colors[colorScheme].text }}
          >
            <Picker.Item label="Select Category" value="" />
            {MOCK_CATEGORIES.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        {category && availableSubCategories.length > 0 && (
          <>
            <ThemedText style={styles.label}>Sub-Category</ThemedText>
            <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].card }]}>
              <Picker
                selectedValue={subCategory}
                onValueChange={(itemValue) => setSubCategory(itemValue)}
                style={styles.picker}
                itemStyle={{ color: Colors[colorScheme].text }}
              >
                <Picker.Item label="Select Sub-Category" value="" />
                {availableSubCategories.map((subCat, index) => (
                  <Picker.Item key={index.toString()} label={subCat} value={subCat} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {category !== 'cat3' && (
          <>
            <ThemedText style={styles.label}>Brand</ThemedText>
            <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].card }]}>
              <Picker
                selectedValue={brand}
                onValueChange={(itemValue) => setBrand(itemValue)}
                style={styles.picker}
                itemStyle={{ color: Colors[colorScheme].text }}
              >
                <Picker.Item label="Select Brand (Optional)" value="" />
                {MOCK_BRANDS.map(br => (
                  <Picker.Item key={br.id} label={br.name} value={br.id} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <ThemedText style={styles.label}>Condition</ThemedText>
        <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].card }]}>
          <Picker
            selectedValue={condition}
            onValueChange={(itemValue) => setCondition(itemValue)}
            style={styles.picker}
            itemStyle={{ color: Colors[colorScheme].text }}
          >
            <Picker.Item label="Select Condition" value="" />
            {MOCK_CONDITIONS.map((cond, index) => (
              <Picker.Item key={index.toString()} label={cond} value={cond} />
            ))}
          </Picker>
        </View>

        <ThemedText style={styles.label}>Price (Ksh)</ThemedText>
        <View style={styles.priceNegotiableRow}>
          <TextInput
            style={[styles.input, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
            placeholder="e.g., 25000"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <View style={styles.negotiableToggle}>
            <Switch
              trackColor={{ false: "#767577", true: activeColor }}
              thumbColor={isNegotiable ? activeColor : "#f4f3f4"}
              onValueChange={setIsNegotiable}
              value={isNegotiable}
            />
            <ThemedText style={styles.negotiableText}>Negotiable</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
          placeholder="Describe your item in detail..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <ThemedText style={styles.label}>Location</ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text, borderColor: isDark ? '#333' : '#ddd' }]}
          placeholder="e.g., Nairobi, Westlands"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />

        <ThemedText style={styles.label}>Upload Images (max 3)</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageUploadScroll}>
          {imageUris.map((uri, index) => (
            <View key={index} style={styles.imagePreviewContainer}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUris(imageUris.filter((_, i) => i !== index))}>
                <Cross size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {imageUris.length < 3 && (
            <TouchableOpacity style={[styles.imageUploadButton, { borderColor: Colors[colorScheme].border, backgroundColor: Colors[colorScheme].card }]} onPress={handleImageUpload}>
              <ImagePlus size={30} color={activeColor} />
              <ThemedText style={styles.uploadText}>Add Photo</ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
        
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: activeColor }]} onPress={handleSubmit}>
          <ThemedText style={styles.submitButtonText}>List Item</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
  screenTitle: { flex: 1, textAlign: 'center', marginLeft: 20, marginRight: 20 },
  formContainer: { paddingHorizontal: 20, paddingBottom: 50 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center', // Center content vertically for Android
  },
  picker: {
    height: 50,
    width: '100%',
  },
  priceNegotiableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    marginRight: 15,
  },
  negotiableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  negotiableText: {
    marginLeft: 8,
    fontSize: 14,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  imageUploadButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  uploadText: {
    fontSize: 12,
    marginTop: 5,
  },
  imagePreviewContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 3,
  },
  submitButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
