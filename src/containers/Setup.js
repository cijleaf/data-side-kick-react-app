import React from 'react'
import { Button, Modal, Label, Grid, Header, Container } from 'semantic-ui-react';


const ModalModalExample = () => (
  <Modal size='large'>
    <Modal.Header>Steps to Get Started</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <Container>
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column>
                <Header>
                  <Label circular color='blue' size='big' key='1'>1</Label>
                  &nbsp;&nbsp;Connect Salesforce
                </Header>
                <div>
                  From the settings page, connect with your Salesforce Production
                  or Sandbox org.
                </div>
            </Grid.Column>
            <Grid.Column>
                <Header>
                  <Label circular color='blue' size='big' key='2'>2</Label>
                  &nbsp;&nbsp;Backup Your Data
                </Header>
                <div>
                  After you connect your Salesforce instance, we will backup
                  your data.  Depending on the size of your database, this may
                  take anywhere from 20 minutes to a few hours.
                </div>
            </Grid.Column>
            <Grid.Column>
                <Header>
                  <Label circular color='blue' size='big' key='3'>3</Label>
                  &nbsp;&nbsp;Review & Undo Changes
                </Header>
                <div>
                  Every day, we will backup your data and highlight changes
                  that were made.  You can review these changes and, if needed,
                  you can undo any of these changes.
                </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Container>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button positive icon='checkmark' labelPosition='right' content='Ok, got it!' />
    </Modal.Actions>
  </Modal>
)

export default ModalModalExample
