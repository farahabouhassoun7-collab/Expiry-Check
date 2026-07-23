import React, { useState } from 'react';
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
import { createInventoryBatch } from '../services/api';
import { Colors } from '../theme';

interface AddBatchModalProps {
  visible: boolean;
  productId: number;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBatchModal({ visible, productId, productName, onClose, onSuccess }: AddBatchModalProps) {
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDays, setExpiryDays] = useState('30'); // Default 30 days
  const [quantity, setQuantity] = useState('50');
  const [purchasePrice, setPurchasePrice] = useState('0');
  const [supplierName, setSupplierName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('Shelf A-1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!batchNumber.trim()) {
      Alert.alert('Required Field', 'Please enter a Batch Number.');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
      return;
    }

    const days = parseInt(expiryDays, 10);
    if (isNaN(days) || days <= 0) {
      Alert.alert('Invalid Days', 'Please enter valid days until expiry.');
      return;
    }

    // Calculate Expiry Date ISO string
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    setLoading(true);
    try {
      await createInventoryBatch({
        productId,
        batchNumber: batchNumber.trim(),
        expiryDate: expiryDate.toISOString(),
        quantity: qty,
        purchasePrice: parseFloat(purchasePrice) || 0,
        supplierName: supplierName.trim() || undefined,
        warehouseLocation: warehouseLocation.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Success', 'Inventory batch added successfully!');
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add inventory batch.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setBatchNumber('');
    setExpiryDays('30');
    setQuantity('50');
    setPurchasePrice('0');
    setSupplierName('');
    setWarehouseLocation('Shelf A-1');
    setNotes('');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Add Batch</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>{productName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textBody} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Batch / Lot Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. BATCH-2026-001"
              value={batchNumber}
              onChangeText={setBatchNumber}
              autoCapitalize="characters"
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Quantity (Units) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="50"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.spacingHorizontal} />
              <View style={styles.flex1}>
                <Text style={styles.label}>Expires in (Days) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  value={expiryDays}
                  onChangeText={setExpiryDays}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Purchase Price ($)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.spacingHorizontal} />
              <View style={styles.flex1}>
                <Text style={styles.label}>Warehouse Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Shelf A-1"
                  value={warehouseLocation}
                  onChangeText={setWarehouseLocation}
                />
              </View>
            </View>

            <Text style={styles.label}>Supplier Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Global Foods Distributors"
              value={supplierName}
              onChangeText={setSupplierName}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Batch quality notes, storage instructions..."
              value={notes}
              onChangeText={setNotes}
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
                <Text style={styles.submitBtnText}>Add Batch</Text>
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
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textBody,
    marginTop: 2,
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
    height: 70,
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

