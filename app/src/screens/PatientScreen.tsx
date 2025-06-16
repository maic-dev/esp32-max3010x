import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { dbfirestore } from '../config/firebase';
import ModalPatientSave from '../components/ModalPatientSave';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  createdAt: Date;
}

const PatientScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const q = query(collection(dbfirestore, 'patients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pts: Patient[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        pts.push({
          id: docSnap.id,
          name: data.name,
          age: data.age,
          phone: data.phone,
          address: data.address,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt,
        });
      });
      setPatients(pts);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar paciente',
      '¿Estás seguro de eliminar este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(dbfirestore, 'patients', id));
              Alert.alert('Éxito', 'Paciente eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el paciente');
              console.error('Error eliminando paciente:', error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Patient }) => (
    <View style={styles.patientItem}>
      <Text style={styles.patientName}>🙍🏻‍♂️ {item.name}</Text>
      <Text>{item.age} años</Text>
      <Text>{item.phone}</Text>
      <Text>{item.address}</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => {
          setEditingPatient(item);
          setModalVisible(true);
        }}>
          <Text style={styles.editButtonText}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleOpenAddModal = () => {
    setEditingPatient(undefined);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button title="Registrar Paciente" onPress={handleOpenAddModal} />
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <ModalPatientSave
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPatient(undefined);
        }}
        patient={editingPatient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  list: {
    marginTop: 20,
  },
  patientItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default PatientScreen;