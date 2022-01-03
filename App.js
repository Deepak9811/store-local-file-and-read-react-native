import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  PermissionsAndroid, Button
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileUrl: 'https://jsonplaceholder.typicode.com/posts',
    }
  }

  componentDidMount() {
    RNFetchBlob.fs.readFile('/storage/emulated/0/Download/Vizsence.json', 'utf8')
      .then((resp) => {
        console.log("local file read :- ", resp);
        // const d = JSON.parse(resp);
        // console.log("d.type :-",d.type)
        // this.setState({ content: resp, fruitType: d.type });
        if(resp.length > 0){
          console.log("resp .lenght  :- ", resp.length)
          RNFetchBlob.fs.unlink('/storage/emulated/0/Download/Vizsence.json','utf8').then((res) => {
            console.log("deleted file :- ", res)
          })
          .catch((err) => {
            console.log("catch error :- ",err.message, err.code);
          });
        }else{
          console.log("empty :- ")
          this.checkPermission()
        }
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });

      this.checkPermission()
    

  }





  async checkPermission() {

    // RNFetchBlob.fs.readFile('/storage/emulated/0/Download/Vizsence.json', 'utf8')
    // .then((res) => {
    //   console.log("local file read :- ",res);
    //   // const d = JSON.parse(res);
    //   // console.log("d.type :-",d.type)
    //   // this.setState({ content: res, fruitType: d.type });
    // })
    // .catch((err) => {
    //   console.log(err.message, err.code);
    // });

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
          // Start downloading
          this.downloadFile();
          // console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };

  downloadFile = () => {
    // File URL which we want to download
    let FILE_URL = this.state.fileUrl;
    // Function to get extention of the file url
    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
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
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
  };

  getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec("json") : undefined;
  };


  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title='Download' onPress={() => this.checkPermission()} />
      </View>
    )
  }
}

const styles = StyleSheet.create({})
