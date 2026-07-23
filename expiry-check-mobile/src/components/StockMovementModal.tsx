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
import { recordStockMovement, InventoryBatch } from '../services/api';
import { Colors } from '../theme';

interface StockMovementModalProps {
  visible: boolean;
  batch: InventoryBatch | null;
  onClose: () => void;
  onSuccess: () => void;
}

type MovementType = 'StockOut' | 'Waste' | 'StockIn' | 'Adjustment';

export function StockMovementModal({ visible, batch, onClose, onSuccess }: StockMovementModalProps) {
  const [movementType, setMovementType] = useState<MovementType>('StockOut');
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (!batch) return null;
  const currentBatch = batch;

  async function handleSubmit() {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
      return;
    }

    if ((movementType === 'StockOut' || movementType === 'Waste') && qty > currentBatch.remainingQuantity) {
      Alert.alert(
        'Insufficient Stock',
        `Cannot remove ${qty} units. Remaining quantity is ${currentBatch.remainingQuantity}.`
      );
      return;
    }

    setLoading(true);
    try {
      await recordStockMovement({
        inventoryBatchId: currentBatch.id,
        movementType,
        quantity: qty,
        reason: reason.trim() || undefined,
        referenceNumber: referenceNumber.trim() || undefined,
      });

      Alert.alert('Success', `Stock movement (${movementType}) recorded successfully!`);
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to record stock movement.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setMovementType('StockOut');
    setQuantity('1');
    setReason('');
    setReferenceNumber('');
  }

  const movementOptions: { type: MovementType; label: string; icon: any; color: string }[] = [
    { type: 'StockOut', label: 'Check Out / Sale', icon: 'arrow-up-circle', color: '#0058be' },
    { type: 'Waste', label: 'Waste / Expired', icon: 'trash-bin', color: '#ba1a1a' },
    { type: 'StockIn', label: 'Check In', icon: 'arrow-down-circle', color: '#006c49' },
    { type: 'Adjustment', label: 'Adjustment', icon: 'sync-circle', color: '#6c7a71' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Record Stock Movement</Text>
              <Text style={styles.headerSubtitle}>
                Batch: {currentBatch.batchNumber} ({currentBatch.remainingQuantity} units in stock)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textBody} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Movement Type *</Text>
            <View style={styles.movementOptionsGrid}>
              {movementOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.type}
                  style={[
                    styles.movementOption,
                    movementType === opt.type && { borderColor: opt.color, backgroundColor: `${opt.color}15` },
                  ]}
                  onPress={() => setMovementType(opt.type)}
                >
                  <Ionicons name={opt.icon} size={20} color={opt.color} />
                  <Text style={[styles.movementOptionText, movementType === opt.type && { color: opt.color, fontWeight: '700' }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Reason / Note</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Expired product disposal, Regular sale, Stock count fix"
              value={reason}
              onChangeText={setReason}
            />

            <Text style={styles.label}>Reference / Invoice Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. INV-99042 or REF-01"
              value={referenceNumber}
              onChangeText={setReferenceNumber}
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
                <Text style={styles.submitBtnText}>Confirm Movement</Text>
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
  movementOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  movementOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  movementOptionText: {
    fontSize: 13,
    color: Colors.textHeading,
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

