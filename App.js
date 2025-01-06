import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Get screen width for responsiveness
const { width } = Dimensions.get('window');

// Stored user details (typically stored in a database)
let storedUser = {
  name: 'Breal John',
  email: 'user@example.com',
  password: 'password123',
};

// News Feed data
const initialNewsFeed = [
  { id: '1', title: 'Breaking News: React Native Updates', description: 'Learn about the latest React Native updates and features.', liked: false, comments: [] },
  { id: '2', title: 'React Native 101', description: 'Getting started with React Native and building mobile apps.', liked: false, comments: [] },
  { id: '3', title: 'JavaScript Best Practices', description: 'Tips and tricks for writing clean and maintainable JavaScript code.', liked: false, comments: [] },
];

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Create Account Screen
function CreateAccountScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      return;
    }
    setError('');
    storedUser = { name, email, password };  // Save user details
    setTimeout(() => {
      navigation.replace('MainApp');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

// Login Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (email !== storedUser.email || password !== storedUser.password) {
      setError('Incorrect email or password.');
      return;
    }
    setError('');
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.link}>Don't have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}

// Notifications Screen
function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {/* Here, we can render notifications */}
    </View>
  );
}

// Profile Screen
function ProfileScreen({ navigation }) {
  const [name, setName] = useState(storedUser.name);
  const [email, setEmail] = useState(storedUser.email);
  const [isEditable, setIsEditable] = useState(false);

  const handleSaveChanges = () => {
    storedUser = { name, email, password: storedUser.password };
    setIsEditable(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      {isEditable ? (
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      ) : (
        <Text style={styles.input}>{name}</Text>
      )}
      {isEditable ? (
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      ) : (
        <Text style={styles.input}>{email}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => isEditable ? handleSaveChanges() : setIsEditable(true)}>
        <Text style={styles.buttonText}>{isEditable ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
      {isEditable && (
        <TouchableOpacity style={styles.button} onPress={() => {
          setName(storedUser.name);
          setEmail(storedUser.email);
          setIsEditable(false);
        }}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Settings Screen
function SettingsScreen({ navigation }) {
  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// Home Screen (with News Feed and Interactive Features)
function HomeScreen() {
  const [newsFeedState, setNewsFeedState] = useState(initialNewsFeed);
  const [newPost, setNewPost] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  
  // Handle like button
  const handleLike = (id) => {
    setNewsFeedState(prevState => {
      return prevState.map(post =>
        post.id === id ? { ...post, liked: !post.liked } : post
      );
    });
  };

  // Handle adding a comment
  const handleAddComment = (id, comment) => {
    setNewsFeedState(prevState => {
      return prevState.map(post => {
        if (post.id === id) {
          return { ...post, comments: [...post.comments, comment] };
        }
        return post;
      });
    });
  };

  // Handle sharing a post (dummy action for now)
  const handleShare = (id) => {
    Alert.alert('Share', `Post with ID: ${id} shared!`);
  };

  // Handle posting a new news feed
  const handlePostNews = () => {
    if (!newPostTitle || !newPost) {
      Alert.alert('Error', 'Both title and description are required to post.');
      return;
    }
    const newNewsFeedItem = {
      id: (newsFeedState.length + 1).toString(),
      title: newPostTitle,
      description: newPost,
      liked: false,
      comments: []
    };
    setNewsFeedState([...newsFeedState, newNewsFeedItem]);
    setNewPost('');
    setNewPostTitle('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      {/* Form to post a new news feed */}
      <View style={styles.postForm}>
        <TextInput
          style={styles.input}
          placeholder="Post Title"
          value={newPostTitle}
          onChangeText={setNewPostTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Post Description"
          value={newPost}
          onChangeText={setNewPost}
        />
        <TouchableOpacity style={styles.button} onPress={handlePostNews}>
          <Text style={styles.buttonText}>Post News</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={newsFeedState}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDescription}>{item.description}</Text>

            {/* Like Button */}
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Text style={styles.likeButton}>{item.liked ? 'Unlike' : 'Like'}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity onPress={() => handleShare(item.id)}>
              <Text style={styles.shareButton}>Share</Text>
            </TouchableOpacity>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              {item.comments.map((comment, index) => (
                <Text key={index} style={styles.commentText}>{comment}</Text>
              ))}
              <TextInput
                style={styles.input}
                placeholder="Add a comment"
                onSubmitEditing={(e) => handleAddComment(item.id, e.nativeEvent.text)}
              />
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

// Main App Screen (Drawer Navigator)
function MainAppScreen() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

// App Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="MainApp" component={MainAppScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  newsItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
  },
  newsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  newsDescription: {
    color: '#666',
    marginBottom: 10,
  },
  likeButton: {
    color: '#007BFF',
    marginTop: 5,
    fontSize: 16,
  },
  shareButton: {
    color: '#007BFF',
    marginTop: 5,
    fontSize: 16,
  },
  commentsSection: {
    marginTop: 10,
  },
  commentText: {
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  postForm: {
    marginBottom: 20,
  },
  link: {
    color: '#007BFF',
    marginTop: 10,
    textAlign: 'center',
  },
});
