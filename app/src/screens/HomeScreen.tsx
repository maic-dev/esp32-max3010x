import { View, Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import ModalHome from '../components/ModalHome';

interface SensorData {
  Sp02?: number;
  BPM?: number;
}

const HomeScreen = () => {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, 'sensor');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setSensorData(data || {});
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>-`♡´- Medical APP -`♡´-</Text>

      <View style={styles.readingContainer}>
        <Text style={styles.label}>🩸 SpO2:</Text>
        <Text style={styles.value}>{sensorData.Sp02 ?? 'Loading...'} %</Text>
      </View>

      <View style={styles.readingContainer}>
        <Text style={styles.label}>❤️ Bpm:</Text>
        <Text style={styles.value}>{sensorData.BPM ?? 'Loading...'} BPM</Text>
      </View>

      <Button title="Guardar datos" onPress={() => setModalVisible(true)} />

      <ModalHome
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        sensorData={sensorData}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  readingContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default HomeScreen;