import React, { Component } from 'react';
import axiosFetch from '../../../../../../utils/axiosSession';
import PostStat from './post_stat';
import PostOption from './post_option';
import { APIPostPathsEndpointsEnum as PostPaths } from '../../../../../../utils/server_endpoints';

import { PrivacyOptionsEnum, PostStatOptionsEnum } from '../../../../../../utils/enums';
import { generateDateString, generateHourString, getItemsArrayFromEnum } from '../../../../../../utils/helperMethods';

class NewsFeedPost extends Component {
  constructor( props ) {
    super( props );
    console.log("this.props")
    console.log(this.props)
    this.flag = false
    this.state = {
      id:this.props.post._id,
      profilepic: this.props.user.profilepic,
      fullname: this.props.user.name.first + ' ' + this.props.user.name.last,
      privacy: this.props.post.privacy,
      hour: generateHourString(this.props.post.createdAt),
      date: generateDateString(this.props.post.createdAt),
      content: this.props.post.content,
      attachments: this.props.post.attachments,
      stats: {
        likes: this.props.post.stats.likes,
        comments: this.props.post.stats.comments
      }
    };

    this.generatePostStatsItems = this.generatePostStatsItems.bind(this);
  }

  getPrivacySvg() {
    if (this.state.privacy === PrivacyOptionsEnum.Global.name) {
      return <PrivacyOptionsEnum.Global.svg />
    }
    return <PrivacyOptionsEnum.Private.svg />
  }

  render() {
    console.log("render News Feed")
    return (
      <div className = "user-post">
        <div className = "header-container">
          <div className = "post-header">
            <div className = "left-picture circle">
              {/*<img src = { this.props.data.profilepic } className = "cover" alt = "author-picture"/>*/}
              <img src = { this.state.profilepic } className = "cover" alt = "author-picture"/>
            </div>

            <div className = "right-details">
              <div className = "author-name">
                { `${this.state.fullname}` }
              </div>

              <div className = "more-details">
                <div className = "privacy-container">
                  <div className = "privacy">
                    { this.getPrivacySvg() }
                  </div>
                </div>

                <div className = "date-and-hour">
                  <div className = "hour">{ this.state.hour }</div>
                  <div className = "date">{ this.state.date }</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className = "post-body">
          <div className = "content-container">
            <div className = "content">{ this.state.content }</div>
          </div>
        </div>

        <div className = "post-attachment">
          <div className = "attachment-picture">
            { this.generatePostAttachmentsItems() }
          </div>
        </div>

        <div className = "post-stats">
          { this.generatePostStatsItems() }
        </div>

        <div className = "options">
          <div className = "container">
            { this.generatePostOptionsItems() }
          </div>
        </div>
      </div>
    );
  };

  generatePostAttachmentsItems() {

    const maxSize = 498;
    const amount = this.state.attachments.length;
    const maxImagesPerLine = 3;
    let width = 0;

    return this.state.attachments.map( (attachment, currentIndex) => {
      if (amount > 3) {
        width = currentIndex < (amount - maxImagesPerLine) ?
          maxSize / (amount - maxImagesPerLine) : maxSize / maxImagesPerLine
      } else {
        width = maxSize / amount;
      }

      return(
        <a href={attachment} target = "_blank">
          <img
            src = { attachment }
            alt = "attachment"
            width = { width } />
        </a>
      );
    });
  }

  generatePostStatsItems() {
    console.log("generatePostStatsItems News Feed");
    return getItemsArrayFromEnum(PostStatOptionsEnum).map( (stat) => {
      return(
        <PostStat
          name = { stat.name }
          amount = { this.state.stats[stat.name.toLowerCase()] } />
      );
    });
  }

  generatePostOptionsItems() {
    console.log("generatePostOptionsItems News Feed;")
    return getItemsArrayFromEnum(PostStatOptionsEnum).map( (option) => {
      return(
        <PostOption onClick = { () => {
          if(this.flag == false) {
            this.flag = true;
            const optionName = option.name.toLowerCase();
            const currentStats = { ...this.state.stats };
            currentStats[optionName] = currentStats[optionName] + 1;
            axiosFetch.patch(`${PostPaths.Posts}/${PostPaths.UpdateStats}/${this.state.id}/${optionName}/${currentStats[optionName]}`)
              .then((result) => {
                console.log(result);
              }).catch((error) => {
                console.log(error);
              });
          this.setState( { stats: currentStats } ); 
            }
        } 
          } >
          <option.svg />
        </PostOption>
      );
      
    });
  }
}

export default NewsFeedPost;