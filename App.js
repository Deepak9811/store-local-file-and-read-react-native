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
import * as Animatable from 'react-native-animatable';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

console.disableYellowBox = true

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileUrl: 'https://ashoka.vizsense.in/api/downloadSS?vendorId=0',
      deleteStatus: false,
      showpop: false,
      localData:[]
    }
  }

  componentDidMount() {
    this.checkInternet()
  }


  checkInternet() {
    
    NetInfo.addEventListener(state => {
      console.log("Connection type ", state.type);
      console.log("Is connected? ", state.isConnected);

      if (state.isConnected === true) {

        this.state.deleteStatus = true
        this.setState({
          showpop: false
        })
        // this.deleteLocalFile()
      } else {
        console.log("for check")
        this.state.deleteStatus = false,
          this.setState({
            showpop: true
          })
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
          if (err.message === "Failed to delete '/storage/emulated/0/Download/Vizsence.json'") {
            this.checkPermission()
          }
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
        console.log("checkPermission :- " + err);
      }
    }
  };

  downloadFile = () => {
    let FILE_URL = this.state.fileUrl;

    let file_ext = this.getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];



    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: "qFGv6gz2/5ovYuFIVxUHIw==",
      uid: "2"
    };


    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    console.log(RootDir)
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/Vizsence' + file_ext,
        description: 'downloading ho rahi h bhai wait kr...',
        notification: true,
        useDownloadManager: true,
      },
    };
    console.log("options :- ",options)
    config(options)
      .fetch('GET', `https://ashoka.vizsense.in/api/supportstaff?vendorId=8&prefix=&staffId=0`,headers)
      .then(res => {
        console.log('res -> ', res.data);
        // alert('File Downloaded Successfully. ' + res.data );

        // if (res.data === "/storage/emulated/0/Download/Vizsence.json") {
        //   console.log("check url work")
          this.readLocalFile()
        // } else {
        //   console.log("not working")
        // }
      });
  };

  getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
      /[^.]+$/.exec("json") : undefined;
  };


  readLocalFile() {
    console.log("reading")
    RNFetchBlob.fs.readFile('/storage/emulated/0/Download/Vizsence.json', 'utf8')
      .then((resp) => {
        console.log("local file read :- ", resp);
        // const d = JSON.parse(resp);
        // console.log("local file read :-  :-", d.data)
        // this.setState({
        //   localData :d.data
        // })
        // this.setState({ content: resp, fruitType: d.type });
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }


  render() {
    return (
      <View style={{ flex: 1, }}>
       
        <Button title='Download' onPress={() => this.deleteLocalFile()}/>

        <Text>{this.state.localData}</Text>




        {/* -------------------SHOW-POP-UP--------------------------------- */}
        {this.state.showpop ? (
          <>
            <View style={styles.popbackgrnd}></View>
            <Animatable.View style={styles.ops} animation={'fadeInUpBig'}>
              <View style={styles.contend}>
                <MaterialIcons size={55} name='signal-wifi-off' color={"#900C3F"} />
                <Text style={styles.mnmsg}>OPPS!</Text>
              </View>
              <Text style={styles.msg}>
                The server is taking too long to respond OR something is wrong with your internet connection.
                Please try again later.
              </Text>

              <View style={styles.btnr}>
                <TouchableOpacity style={styles.btnt} onPress={() => this.checkInternet()}>
                  <Text style={{ fontSize: 16, color: "#fff" }}>
                    RETRY
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </>
        ) : null}



      </View>
    )
  }
}

const styles = StyleSheet.create({
  popbackgrnd: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // backgroundColor:'rgba(0,0,0,0,8)',
    width: '100%',
  },
  ops: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    // bottom: 0,
    margin: '5%',
    backgroundColor: '#fff',
    elevation: 2,
    padding: "5%",
    borderRadius: 5
  },
  contend: { justifyContent: "center", alignItems: "center", width: "100%" },
  mnmsg: { textAlign: "center", fontSize: 25, marginBottom: "3%" },
  msg: { textAlign: "center", fontSize: 15, color: "#0C0B0B" },
  btnr: { alignItems: "center", justifyContent: "center", marginTop: "5%", marginBottom: "5%" },
  btnt: { borderRadius: 50, alignItems: "center", backgroundColor: "#900C3F", width: "50%", padding: 8 },
})
