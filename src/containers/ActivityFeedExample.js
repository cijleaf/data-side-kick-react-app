import React, { Component } from 'react';
import { Feed, Container, Header, Segment, List, Icon } from 'semantic-ui-react';

export default class ActivityFeed extends Component {
  render() {
    return (
      <div>
        <br />
        <Container>
          <Segment.Group horizontal>
            <Segment>
              <Header as="h2">Account Activity</Header>
              <Feed>
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" color="red" />} />}
                  date="Today"
                  summary="Failed to back up Accounts from MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" color="green" />} />}
                  date="Today"
                  summary="Successfully backed up Leads from MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" color="green" />} />}
                  date="Today"
                  summary="Successfully backed up Contacts from MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="undo" color="green" />} />}
                  date="Today"
                  summary="Restored 22 values in Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" />} />}
                  date="Today"
                  summary="Successfully backed up Accounts from MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="compress" color="green" />} />}
                  date="Yesterday"
                  summary="Merged 12 Leads in MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="signal" color="green" />} />}
                  date="Last Monday"
                  summary="Made 44 improvements to Leads in MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" />} />}
                  date="Last Monday"
                  summary="Successfully backed up Leads from MyCompany Production Salesforce"
                />
                <Feed.Event
                  icon={<Feed.Label content={<Icon size="large" name="database" />} />}
                  date="Last Monday"
                  summary="Successfully backed up Contacts from MyCompany Production Salesforce"
                />
              </Feed>
            </Segment>
            <Segment>
              <Header as="h2">ToDo List</Header>
              <List divided relaxed>
                <List.Item>
                  <List.Icon name="plug" color="blue" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Connect Your CRM</List.Header>
                    <List.Description as="a">Establish a connection with Salesforce</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="users" color="blue" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Invite Your Colleagues</List.Header>
                    <List.Description as="a">Why go it alone?</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="mail" color="blue" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header as="a">Send us your feedback</List.Header>
                    <List.Description as="a">Help us help you!</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          </Segment.Group>
        </Container>
      </div>
    );
  }
}
