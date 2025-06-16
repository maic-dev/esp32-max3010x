import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Button, TextInput, FlatList, Alert, TouchableWithoutFeedback } from 'react-native';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { dbfirestore } from '../config/firebase';

interface SensorData {
    Sp02?: number; BPM?: number;
}

interface User {
    id: string; name: string;
}

interface ModalHomeProps {
    visible: boolean; onClose: () => void; sensorData: SensorData;
}

const ModalHome: React.FC<ModalHomeProps> = ({ visible, onClose, sensorData }) => {
    const [sp02, setSp02] = useState<string>('');
    const [bpm, setBpm] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const q = query(collection(dbfirestore, 'patients'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list: User[] = [];
            snapshot.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data().name });
            });
            setUsers(list);
        });
        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (sensorData.Sp02 !== undefined) {
            setSp02(sensorData.Sp02.toString());
        }
        if (sensorData.BPM !== undefined) {
            setBpm(sensorData.BPM.toString());
        }
    }, [sensorData]);

    const handleSaveHistory = async () => {
        if (!selectedUser) {
            Alert.alert("Error", "Seleccione un paciente");
            return;
        }
        try {
            await addDoc(collection(dbfirestore, "historial"), {
                userId: selectedUser.id,
                bpm: parseInt(bpm, 10),
                sp02: parseInt(sp02, 10),
                timestamp: new Date(),
            });
            Alert.alert("Éxito", "Historial guardado");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el historial");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>🎯 REGISTRAR</Text>
                            
                            <View style={styles.separator} />

                            <View style={styles.searchSection}>
                                <Text style={styles.searchLabel}>🔎 Buscar paciente:</Text>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Ingrese nombre..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                />
                                {searchTerm.length > 0 && (
                                    <FlatList
                                        data={filteredUsers}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.userItem}
                                                onPress={() => {
                                                    setSelectedUser(item);
                                                    setSearchTerm('');
                                                }}
                                            >
                                                <Text>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                            </View>

                            <View style={styles.separator} />

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>🙍🏻‍♂️ Paciente:</Text>
                                <Text style={styles.value}>
                                    {selectedUser ? selectedUser.name : 'No seleccionado'}
                                </Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>🩸 SpO₂:</Text>
                                <Text style={styles.value}>{sp02}</Text>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>❤️ BPM:</Text>
                                <Text style={styles.value}>{bpm}</Text>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleSaveHistory}>
                                <Text style={styles.buttonText}>💾 Guardar</Text>
                            </TouchableOpacity>
                            <Button title="Cerrar" onPress={onClose} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        padding: 30,
        borderRadius: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 5,
    },
    value: {
        textAlign: 'center',
        fontSize: 15,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    searchSection: {
        marginTop: 10,
    },
    searchLabel: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 5,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
    },
    userItem: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    separator: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    button: {
        borderWidth: 1,
        borderColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 15,
        fontWeight: "bold",
    },
});

export default ModalHome;