import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import ModalUpdateProfile from '../components/ModalUpdateProfile';

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Obtenemos el usuario logueado

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: () => {
            signOut(auth)
              .then(() => { })
              .catch((error) => {
                Alert.alert("Error", error.message);
              });
          }
        }
      ]
    );
  };

  const openEditNameModal = () => {
    setNewName('');
    setModalVisible(true);
  };

  const handleSaveName = () => {
    if (newName) {
      updateProfile(auth.currentUser, { displayName: newName })
        .then(() => {
          Alert.alert("Nombre actualizado");
          setModalVisible(false);
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {user && user.displayName ? (
          <Text style={styles.name}>Bienvenido 👋 {user.displayName}</Text>
        ) : (
          <TouchableOpacity onPress={openEditNameModal}>
            <Text style={styles.editName}>Editar nombre</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>📧 {user?.email || "Email no disponible"}</Text>
      </View>
      <Button title="🚨 Cerrar sesión" onPress={handleSignOut} color="#555" />

      <ModalUpdateProfile
        visible={modalVisible}
        newName={newName}
        setNewName={setNewName}
        onSave={handleSaveName}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  editName: {
    fontSize: 18,
    color: '#007BFF',
  },
  infoCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
});

export default ProfileScreen;