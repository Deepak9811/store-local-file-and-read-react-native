import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  PermissionsAndroid, Button, Alert
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

import NetInfo from "@react-native-community/netinfo";

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileUrl: 'https://jsonplaceholder.typicode.com/posts',
      deleteStatus: false,
    }
  }

  componentDidMount() {

    //-----------------CHECK-INTERNET-CONNECTED-OR-NOT----------------------------------
    NetInfo.addEventListener(state => {
      console.log("Connection type ", state.type);
      console.log("Is connected? ", state.isConnected);

      if (state.isConnected === true) {

        this.state.deleteStatus = true
          // this.deleteLocalFile()
      } else {
        this.state.deleteStatus = false,
          Alert.alert("Something wents wrong.", "Check your connections.", [{ text: "okay" }], { cancelable: true })
      }
    });


  }

  deleteLocalFile() {
    if (this.state.deleteStatus === true) {
      RNFetchBlob.fs.unlink('/storage/emulated/0/Download/Vizsence.json', 'utf8').then((resp) => {
        console.log("deleted file :- ", resp)
        if (resp === undefined) {
          console.log("deleted file  ",)
          this.checkPermission()
        } else {
          console.log("don't know ")
        }
      })
        .catch((err) => {
          console.log("catch error :- ", err.message, err.code);
          if(err.message === "Failed to delete '/storage/emulated/0/Download/Vizsence.json'"){
            this.checkPermission()
          }
          // this.checkPermission()
        });

      // console.log("internet is connect.")
    } else {
      console.log("internet is not connect.")
    }




  }





  async checkPermission() {


    if (Platform.OS === 'ios') {
      this.downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadFile();
        } else {
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        console.log("++++" + err);
      }
    }
  };

  downloadFile = () => {
    let FILE_URL = this.state.fileUrl;

    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];


    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    console.log(RootDir)
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/Vizsence' + file_ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        console.log('res -> ', JSON.stringify(res.data));
        // alert('File Downloaded Successfully. ' + res.data );

        if (res.data === "/storage/emulated/0/Download/Vizsence.json") {
          console.log("check url work")
          this.readLocalFile()
        } else {
          console.log("not working")
        }
      });
  };

  getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec("json") : undefined;
  };


  readLocalFile() {
    RNFetchBlob.fs.readFile('/storage/emulated/0/Download/Vizsence.json', 'utf8')
      .then((resp) => {
        console.log("local file read :- ", resp.type);
        // const d = JSON.parse(resp);
        // console.log("d.type :-",d.type)
        // this.setState({ content: resp, fruitType: d.type });
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title='Download' onPress={() => this.deleteLocalFile()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({})
