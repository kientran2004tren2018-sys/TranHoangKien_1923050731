import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// ============================================
// STUDENT ID CONSTANT - DO NOT MODIFY (usage #1)
// ============================================
const STUDENT_ID = "1923050731";

// Derive theme values from STUDENT_ID digits/length
const idDigit1 = parseInt(STUDENT_ID[0], 10) || 1;    // usage #2
const idDigit2 = parseInt(STUDENT_ID[STUDENT_ID.length - 1], 10) || 1; // usage #3
const idLength = STUDENT_ID.length;                    // usage #4

// Dark/Blue theme shades, index picked using STUDENT_ID digits
const BLUE_SHADES = ['#0B1D3A', '#0F2A4A', '#123A5C', '#14497A', '#1A5C9C', '#2170B8', '#2E86D6', '#3592E0', '#3D9BFF', '#4DA3FF'];
const ACCENT_SHADES = ['#4DA3FF', '#3B9AFF', '#5AB0FF', '#2E8BFF', '#68B8FF', '#3D9BFF', '#57ACFF', '#60A5FA', '#38BDF8', '#0EA5E9'];

const THEME = {
  background: BLUE_SHADES[idDigit1 % BLUE_SHADES.length], // usage #5
  card: BLUE_SHADES[(idDigit1 + 2) % BLUE_SHADES.length],
  accent: ACCENT_SHADES[idDigit2 % ACCENT_SHADES.length],
  borderRadius: 8 + idLength * 2, // usage #6 - radius derived from ID length
  spacing: 8 + idDigit2,          // padding derived from ID digit
};

const CATEGORIES = [
  { key: 'work', label: 'Công việc', color: '#4DA3FF' },
  { key: 'personal', label: 'Cá nhân', color: '#7CD672' },
  { key: 'study', label: 'Học tập', color: '#FFD166' },
  { key: 'other', label: 'Khác', color: '#C79CFF' },
];

// ============================================
// COMPONENT: Header
// ============================================
function Header({ totalCount, completedCount }) {
  return (
    <View style={[styles.header, { borderRadius: THEME.borderRadius, backgroundColor: THEME.card }]}>
      <Text style={styles.headerTitle}>📝 Ứng Dụng Việc Cần Làm</Text>
      <Text style={styles.headerSubtitle}>Mã sinh viên: {STUDENT_ID}</Text>
      <Text style={styles.headerStats}>
        Đã hoàn thành {completedCount}/{totalCount}
      </Text>
    </View>
  );
}

// ============================================
// COMPONENT: CategoryPicker
// ============================================
function CategoryPicker({ selected, onSelect }) {
  return (
    <View style={styles.categoryRow}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryChip,
              { borderColor: cat.color },
              isActive && { backgroundColor: cat.color },
            ]}
            onPress={() => onSelect(cat.key)}
          >
            <Text style={[styles.categoryChipText, isActive && { color: '#0B1D3A' }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================
// COMPONENT: AddTodoForm
// ============================================
function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('work');

  const handleAdd = () => {
    if (text.trim().length === 0) return;
    onAdd(text.trim(), category);
    setText(''); // clear input after adding
  };

  return (
    <View style={[styles.formContainer, { backgroundColor: THEME.card, borderRadius: THEME.borderRadius }]}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={`Thêm việc cần làm (MSSV ${STUDENT_ID})...`} // usage #7
          placeholderTextColor="#8FA3C0"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: THEME.accent }]}
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <CategoryPicker selected={category} onSelect={setCategory} />
    </View>
  );
}

// ============================================
// COMPONENT: TodoItem (checkbox list style)
// ============================================
function TodoItem({ todo, onToggle, onDelete }) {
  const category = CATEGORIES.find((c) => c.key === todo.category) || CATEGORIES[3];

  return (
    <View style={[styles.todoItem, { borderRadius: THEME.borderRadius, backgroundColor: THEME.card }]}>
      <TouchableOpacity style={styles.checkboxRow} onPress={() => onToggle(todo.id)}>
        <View
          style={[
            styles.checkbox,
            { borderColor: THEME.accent },
            todo.completed && { backgroundColor: THEME.accent },
          ]}
        >
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.todoTextContainer}>
          <Text style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
            {todo.text}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            <Text style={styles.categoryBadgeText}>{category.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(todo.id)}>
        <Text style={styles.deleteButtonText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// COMPONENT: TodoList
// ============================================
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>Chưa có việc nào. Thêm một việc ở trên nhé! 🚀</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ScrollView>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Hoàn thành bài tập React Native', completed: false, category: 'study' },
    { id: 2, text: 'Ôn lại tài liệu về flexbox layout', completed: true, category: 'study' },
  ]);

  const addTodo = (text, category) => {
    const newTodo = { id: Date.now(), text, completed: false, category };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: THEME.background }]}>
      <StatusBar barStyle="light-content" />
      <Header totalCount={todos.length} completedCount={completedCount} />
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thực hiện bởi Sinh viên {STUDENT_ID} · Chủ đề Dark/Blue</Text>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    padding: THEME.spacing,
    marginBottom: 12,
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: THEME.accent, fontSize: 13, marginTop: 4 },
  headerStats: { color: '#B8C7DE', fontSize: 12, marginTop: 4 },
  formContainer: { padding: THEME.spacing, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#0B1D3A',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius,
    marginRight: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#0B1D3A', fontSize: 24, fontWeight: 'bold' },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  categoryChipText: { color: '#FFFFFF', fontSize: 12 },
  list: { flex: 1 },
  listContent: { paddingBottom: 16 },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing,
    marginBottom: 10,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#0B1D3A', fontWeight: 'bold' },
  todoTextContainer: { flex: 1 },
  todoText: { color: '#FFFFFF', fontSize: 15 },
  todoTextCompleted: { textDecorationLine: 'line-through', color: '#7A8CA8' },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  categoryBadgeText: { fontSize: 10, fontWeight: '600', color: '#0B1D3A' },
  deleteButton: { padding: 8 },
  deleteButtonText: { fontSize: 18 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { color: '#7A8CA8', fontSize: 14 },
  footer: { paddingVertical: 10, alignItems: 'center' },
  footerText: { color: '#5C7095', fontSize: 11 },
});