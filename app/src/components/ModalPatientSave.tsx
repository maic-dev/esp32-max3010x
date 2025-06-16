import { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Alert, TouchableWithoutFeedback } from 'react-native';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { dbfirestore } from '../config/firebase';

interface Patient {
    id?: string; name: string; age: number; phone: string; address: string;
}

interface ModalPatientSaveProps {
    visible: boolean;
    onClose: () => void;
    patient?: Patient;
}

const ModalPatientSave: React.FC<ModalPatientSaveProps> = ({ visible, onClose, patient }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (patient) {
            setName(patient.name);
            setAge(patient.age.toString());
            setPhone(patient.phone);
            setAddress(patient.address);
        } else {
            setName(''); setAge(''); setPhone(''); setAddress('');
        }
    }, [patient, visible]);

    const handleSubmit = async () => {
        if (!name || !age || !phone || !address) {
            Alert.alert('Error', 'Por favor llene todos los campos');
            return;
        }
        try {
            if (patient && patient.id) {
                const patientRef = doc(dbfirestore, 'patients', patient.id);
                await updateDoc(patientRef, {
                    name, age: parseInt(age, 10), phone, address,
                });
                Alert.alert('Éxito', 'Paciente actualizado exitosamente');
            } else {
                await addDoc(collection(dbfirestore, 'patients'), {
                    name, age: parseInt(age, 10), phone, address, createdAt: new Date(),
                });
                Alert.alert('Éxito', 'Paciente registrado exitosamente');
            }
            setName(''); setAge(''); setPhone(''); setAddress('');

            onClose();
        } catch (error) {
            Alert.alert('Error', patient ? 'Error al actualizar el paciente' : 'Error al registrar el paciente');
            console.error(patient ? 'Error updating patient:' : 'Error registering patient:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>🎯 PACIENTE</Text>
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Edad"
                                keyboardType="numeric"
                                value={age}
                                onChangeText={setAge}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Dirección"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>
                                    {patient ? "💾  Guardar" : "💾  Registrar"}
                                </Text>
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
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        margin: 20,
        padding: 30,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        fontSize: 15,
        marginBottom: 10,
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
    separator: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
});

export default ModalPatientSave;