import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#007AFF',
        accent: '#FFC107',
        background: '#f5f5f5',
    },
};

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Login exitoso', 'Sesión iniciada correctamente.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <PaperProvider theme={customTheme}>
            <View style={styles.container}>
                <Image source={require('../../assets/inicio-de-sesion.png')} style={styles.logo} />
                <Text style={styles.title}>Bital App</Text>
                <Text style={styles.slogan}>Conectando tecnología con tu bienestar 👋</Text>

                <TextInput
                    label="Correo electrónico"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Iniciar Sesión
                </Button>
            </View>
        </PaperProvider>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    slogan: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        padding: 5,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },

});
