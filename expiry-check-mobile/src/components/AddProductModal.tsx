import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createProduct, getFullCategories, Category } from '../services/api';
import { Colors } from '../theme';


interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ visible, onClose, onSuccess }: AddProductModalProps) {
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [brand, setBrand] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  async function loadCategories() {
    try {
      const cats = await getFullCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !sku.trim()) {
      Alert.alert('Required Fields', 'Please enter Product Name and SKU.');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Category Required', 'Please select a product category.');
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        sku: sku.trim(),
        title: title.trim(),
        barcode: barcode.trim() || undefined,
        description: description.trim() || undefined,
        categoryId: selectedCategoryId,
        price: parseFloat(price) || 0,
        minStockLevel: parseInt(minStockLevel, 10) || 5,
        brand: brand.trim() || undefined,
      });

      Alert.alert('Success', 'Product created successfully!');
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSku('');
    setTitle('');
    setBarcode('');
    setDescription('');
    setPrice('');
    setMinStockLevel('5');
    setBrand('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Product</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textBody} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Organic Fresh Milk 1L"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>SKU Code *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. MLK-1001"
                  value={sku}
                  onChangeText={setSku}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.spacingHorizontal} />
              <View style={styles.flex1}>
                <Text style={styles.label}>Barcode / EAN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 629100123"
                  value={barcode}
                  onChangeText={setBarcode}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    selectedCategoryId === cat.id && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategoryId === cat.id && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Price ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.spacingHorizontal} />
              <View style={styles.flex1}>
                <Text style={styles.label}>Min Stock Level</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  value={minStockLevel}
                  onChangeText={setMinStockLevel}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Almarai"
              value={brand}
              onChangeText={setBrand}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional notes or details..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Create Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  closeButton: {
    padding: 4,
  },
  formScroll: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textBody,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textHeading,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  spacingHorizontal: {
    width: 12,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  categoryChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textBody,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textBody,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

