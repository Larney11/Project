import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableHighlight
} from 'react-native'
const { width, height } = Dimensions.get('window');


var Store = require('./../store/Store.js')

class RouteList extends Component {
  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      selectedRowID: null
    };
  }

  componentDidMount() {

    Store.getRoutes().then((routesArray) => {
      console.log("+++++++++++++++++++++++oopopopopopopopopopopopopop878789789799999999999");
      console.log(routesArray);
      /*
      var routesArrayLength = routesArray.length;
      var logoImages = [];
      var i;
      for(i=0; i<routesArrayLength; i++){

        logoImages[i] = require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
      }
      */

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(routesArray),
        //logos: logoImages,
        //routesArrayLength: routesArrayLength
      });
      /*
      var message;
      var rowID;
      for(rowID = 0; rowID<routesArrayLength; rowID++){
        message = messages[rowID];
        if(message) {
          uri_message = message.account.logo.uri;
          mimetype_message = message.account.logo.mimetype;
          filename_message = message.account.logo.filename;
          this.getLogoImage(uri_message, filename_message, mimetype_message, rowID);
        }
      }
      */
    },(resaon) => {
      console.log("-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=", resaon);

    });
  };


  //=========================================


  handleSelectedRow(rowID) {

      var selectedRowID = this.state.selectedRowID;
      if(selectedRowID == rowID) {

         this.setState({
            selectedRowID: null
         })
      }
      else if(selectedRowID != rowID) {

         this.setState({
            selectedRowID: rowID
         })
      }
   }


   _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
     return (

       <View
         key={`${sectionID}-${rowID}`}
         style={{
           height: adjacentRowHighlighted ? 4 : 1,
           backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
         }}
       />
     );
   }


    _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

      console.log("f-=-=-=-=-=-=-=================");
      console.log(rowData);
      var route_id = rowData.route_id;
      var title = rowData.title;
      var description = rowData.description;

      return (

         <View>
            <TouchableHighlight onPress={ () => {
               this.handleSelectedRow(rowID)
            }}>
               <View style={styles.rowContainer}>

                  <Image style={styles.thumb} source={require('../../Resources/img/loginBackground.jpg')} />

                  <View style={styles.rowContents}>
                      <Text style={styles.subtext}>
                         {rowData.get("title")}
                      </Text>
                      <Text style={styles.text}>
                         {rowData.get("description")}
                      </Text>
                  </View>
               </View>
            </TouchableHighlight>
         </View>
       )
    }


    render() {

         return (

           <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderRow}
             renderSeparator={this._renderSeperator}
           />
        )
   }
   //===================


}


var styles = StyleSheet.create({
  listviewContainer: {
    flex: 1
  },
      rowContainer: {
        flexDirection: 'row',
        //justifyContent: 'center',
        padding: 5,
        backgroundColor: 'white',
      },
          thumb: {
            width: 50,
            height: 50,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'grey',
            marginRight: 5,
            marginBottom: 5,
          },
          rowContents: {
            flexDirection: 'column',
          },
              text: {
                //width: (width * 0.5),
                //fontSize: 16,
                //fontWeight: '600',
                //color: '#ffffff',
              },
              subtext: {

              },
              datetime: {

              },
      deleteButton: {

      },
});

module.exports = RouteList;
