import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

interface ModalUpdateProfileProps {
    visible: boolean;
    newName: string;
    setNewName: (name: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const ModalUpdateProfile = ({ visible, newName, setNewName, onSave, onCancel }: ModalUpdateProfileProps) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editar nombre</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu nombre"
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Guardar" onPress={onSave} />
                        <Button title="Cancelar" onPress={onCancel} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default ModalUpdateProfile;