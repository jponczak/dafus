import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap'


export default class Introduction extends Component {
    render() {
        return (
            <Container fluid>
                <p>
                    DAFUS, which stands for the Declaration of Affection and Friendship for the United States, 
                    provides a simple and easy way to look for family and friends signatures from 1926. These signatures
                    were originally in more than 100 large volumes, and were given to the United States from Poland as a 
                    thank you for assistance during World War 1.
                </p>
                <p>
                    The volumes were recently digitized and are available to view within the Library of Congress's website. 
                    Unfortunately, searching these digital volumes is time consuming and complicated. This site, funded and created by
                    volunteers, is a simple way to seach by a town or district, and easily link to the specific page of signatures 
                    within the Library of Congress.
                </p>
            </Container>
        );
    }
}