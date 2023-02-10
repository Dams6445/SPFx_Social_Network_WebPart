import * as React from 'react';
import { ServiceScope } from '@microsoft/sp-core-library';
import { InstaService } from "../model/InstaService";
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import Stories from 'react-insta-stories';
import { Story } from 'react-insta-stories/dist/interfaces';
import styles from '../webparts/storyInsta/StoryInstaWebPart.module.scss';

const customSeeMore = {
  fontSize: 14,
  color: "white",
  bottom: 20,
};

export interface IStoryInstaProps {
  nbInstaStories: number,
  serviceScope: ServiceScope
}

export const StoryInsta = (props: IStoryInstaProps) => {
  const [story, setStory] = React.useState<Story[]>(null);

  const {
    nbInstaStories
  } = props;

  React.useEffect(() => {
    const instaService = props.serviceScope.consume(InstaService.serviceKey);

    const getAccountData = async () => {
      const [_testStoriesData] = await Promise.all([instaService.getStoryData()]);
      const profilePic = _testStoriesData[0];
      const tabStoryData =  _testStoriesData.slice(1,6).reverse();
      console.log("tabStoryData : ", tabStoryData)
      const stories: Story[] =
      tabStoryData.slice(0,nbInstaStories).map((story) => {
        const jsonStory = JSON.parse(story);
          if (jsonStory.media_type != "IMAGE") {
            return {
              url: jsonStory.media_url,
              type: 'video',
              header: {
                heading: jsonStory.username,
                subheading: jsonStory.timestamp.replace("T", " ").replace("+0000", " UTC"),
                profileImage: profilePic
              },
              seeMore: ({ close }) => {
                window.open(jsonStory.permalink, '_blank');
                return <div className={styles.closeStoryPopUp} onClick={close}>Cliquez pour reprendre la Story</div>;
              }
            }
          }
          return {
            url: jsonStory.media_url,
            header: {
              heading: jsonStory.username,
              subheading: jsonStory.timestamp.replace("T", " ").replace("+0000", " UTC"),
              profileImage: profilePic
            },
            seeMore: ({ close }) => {
              window.open(jsonStory.permalink, '_blank');
              return <div className={styles.closeStoryPopUp} onClick={close}>Cliquez pour retourner à la Story</div>;
            }
          }
        });
      setStory(stories)
    }
    getAccountData();
  }, [nbInstaStories]);

  if (!story) {
    return (
      <Shimmer />
    )
  }
  else {
    return (
      <div className={styles.storyContainer}>
        <Stories
          stories={story}
          defaultInterval={2500}
          loop={true}
          width={styles.storyContainer}
          height={styles.storyContainer}
        />
      </div>
    )
  }
}