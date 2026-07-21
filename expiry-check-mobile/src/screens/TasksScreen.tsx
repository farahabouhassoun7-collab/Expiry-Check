import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius, Shadows } from '../theme';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import type { Task, RiskLevel } from '../types';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Check dairy section expiry dates',    description: 'Scan all dairy products and flag items expiring within 3 days', priority: 'critical', completed: false, assignedTo: 'Alex Rivera', dueTime: '9:00 AM'  },
  { id: '2', title: 'Update produce shelf labels',         description: 'Reprint price and expiry labels for the produce aisle',          priority: 'high',     completed: false, assignedTo: 'Alex Rivera', dueTime: '10:30 AM' },
  { id: '3', title: 'Clear bakery display',                description: 'Remove day-old items and restock fresh bakery products',          priority: 'medium',   completed: false, assignedTo: 'Alex Rivera', dueTime: '12:00 PM' },
  { id: '4', title: 'Restock frozen aisle',                description: 'Check frozen goods and restock from back store',                  priority: 'low',      completed: false, assignedTo: 'Alex Rivera', dueTime: '2:00 PM'  },
  { id: '5', title: 'Morning walk completed',              description: 'Completed morning inspection of all departments',                 priority: 'high',     completed: true,  assignedTo: 'Alex Rivera', dueTime: '8:00 AM'  },
  { id: '6', title: 'Apply AI discount to short-dated items', description: 'Implement 25% markdown on items expiring in 2 days',          priority: 'critical', completed: true,  assignedTo: 'Alex Rivera', dueTime: '8:30 AM'  },
];

const FILTERS = ['All', 'Pending', 'Done'] as const;

function TaskItem({ task, onToggle, index }: { task: Task; onToggle: (id: string) => void; index: number }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePress() {
    scale.value = withSpring(0.97, { damping: 12 }, () => { scale.value = withSpring(1); });
    onToggle(task.id);
  }

  const borderColor = {
    critical: Colors.error,
    high:     Colors.tertiary,
    medium:   Colors.secondary,
    low:      Colors.primary,
  }[task.priority];

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Animated.View style={animStyle}>
        <TouchableOpacity
          style={[styles.taskCard, { borderLeftColor: borderColor }, task.completed && styles.taskDone]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {/* Checkbox */}
          <TouchableOpacity style={[styles.checkbox, task.completed && styles.checkboxDone]} onPress={handlePress}>
            {task.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.taskBody}>
            <View style={styles.taskTop}>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]} numberOfLines={1}>
                {task.title}
              </Text>
              <StatusBadge level={task.priority} size="sm" />
            </View>
            <Text style={styles.taskDesc} numberOfLines={2}>{task.description}</Text>
            <View style={styles.taskMeta}>
              <Ionicons name="time-outline" size={12} color={Colors.outline} />
              <Text style={styles.taskMetaText}>{task.dueTime}</Text>
              <Ionicons name="person-outline" size={12} color={Colors.outline} style={{ marginLeft: Spacing.sm }} />
              <Text style={styles.taskMetaText}>{task.assignedTo}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

export default function TasksScreen() {
  const [tasks,     setTasks]     = useState<Task[]>(MOCK_TASKS);
  const [filter,    setFilter]    = useState<typeof FILTERS[number]>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setTasks([...MOCK_TASKS]); setRefreshing(false); }, 1000);
  }, []);

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  const filtered = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Done')    return t.completed;
    return true;
  });

  const done    = tasks.filter(t => t.completed).length;
  const total   = tasks.length;
  const pct     = total > 0 ? done / total : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Today's Tasks" subtitle={`${done}/${total} completed`} />

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width: `${pct * 100}%` as any }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(pct * 100)}% done</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.chips}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        renderItem={({ item, index }) => <TaskItem task={item} onToggle={toggleTask} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState icon="checkbox-outline" title="No tasks" subtitle="All caught up!" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Colors.background },
  progressWrap:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: Colors.backgroundPure, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  progressBg:     { flex: 1, height: 6, backgroundColor: Colors.surfaceContainer, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  progressText:   { ...Typography.caption, color: Colors.primary, fontWeight: '700', minWidth: 50, textAlign: 'right' },
  chips:          { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm, backgroundColor: Colors.backgroundPure, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  chip:           { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.background },
  chipActive:     { borderColor: Colors.primary, backgroundColor: 'rgba(0,108,73,0.08)' },
  chipText:       { ...Typography.smallBold, color: Colors.textBody },
  chipTextActive: { color: Colors.primary },
  list:           { padding: Spacing.base, gap: Spacing.md, paddingBottom: 100 },
  taskCard:       { backgroundColor: Colors.backgroundPure, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.borderSubtle, borderLeftWidth: 4, padding: Spacing.base, flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', ...Shadows.card },
  taskDone:       { opacity: 0.6 },
  checkbox:       { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.borderSubtle, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  checkboxDone:   { backgroundColor: Colors.primary, borderColor: Colors.primary },
  taskBody:       { flex: 1, gap: Spacing.xs },
  taskTop:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  taskTitle:      { ...Typography.bodyBold, color: Colors.textHeading, flex: 1 },
  taskTitleDone:  { textDecorationLine: 'line-through', color: Colors.outline },
  taskDesc:       { ...Typography.small, color: Colors.textBody, lineHeight: 18 },
  taskMeta:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  taskMetaText:   { ...Typography.caption, color: Colors.outline },
});
