import { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { Button, Text } from 'react-native-paper';

import ModalUpdateProfile from '../components/ModalUpdateProfile';

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;

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
      updateProfile(auth.currentUser!, { displayName: newName })
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
    <View style={[styles.container]}>
      <View style={styles.profileHeader}>
        {user?.displayName ? (
          <Text style={[styles.name]}>
            Bienvenido 👋 {user.displayName}
          </Text>
        ) : (
          <TouchableOpacity onPress={openEditNameModal}>
            <Text style={[styles.editName]}>Editar nombre</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.infoCard]}>
        <Text style={[styles.infoText]}>
          📧 {user?.email || "Email no disponible"}
        </Text>
      </View>

      <View style={[styles.infoCard]}>
        <Text style={[styles.bitalTitle]}>¿Por qué Bital?</Text>
        <Text style={[styles.bitalText]}>
          <Text style={{ fontWeight: 'bold' }}>“Bit”</Text> representa la tecnología, los datos y la precisión digital.{"\n"}
          <Text style={{ fontWeight: 'bold' }}>“Vital”</Text> habla de salud, vida y lo esencial para el cuerpo.{"\n\n"}
          Bital une estos dos mundos para ayudarte a cuidar lo más importante: tu bienestar.
        </Text>
      </View>


      <Button
        mode="outlined"
        icon="logout"
        onPress={handleSignOut}
        style={[styles.logoutButton, { borderColor: '#FF3B30' }]}
        contentStyle={{ paddingVertical: 5 }}
        labelStyle={{ color: '#FF3B30', fontWeight: 'bold' }}
      >
        Cerrar sesión
      </Button>

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
    alignItems: 'center',
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  editName: {
    fontSize: 18,
  },
  infoCard: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  bitalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  bitalText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleButton: {
    width: '90%',
    marginTop: 10,
    borderRadius: 8,
  },
  logoutButton: {
    width: '90%',
    borderWidth: 1.2,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default ProfileScreen;