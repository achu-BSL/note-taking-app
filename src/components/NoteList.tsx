import React, { useMemo, useState } from 'react';
import { Col, Row, Stack, Button, Form, Card, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Tag } from '../App';
import styles from '../assets/css/NoteList.module.css'


type SimplifiedNote = {
    tags: Tag[];
    id: string;
    title: string;
}

type NoteListProps = {
    availableTags: Tag[];
    notes: SimplifiedNote[]
}

export const NoteList: React.FC<NoteListProps> = ({ availableTags, notes }) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (note.title === '' || note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag => {
                        return note.tags.some(noteTag => noteTag.id === tag.id)
                    }))
        })
    }, [selectedTags, title, notes])
    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction='horizontal'>
                        <Link to="/new">
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button variant='outline-secondary'>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={title} onChange={e => setTitle(prev => e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                options={availableTags.map(tag => (
                                    { label: tag.label, value: tag.id }
                                ))}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal />
        </>
    );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className='align-items-center justify-content-center h-100'>
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && <Stack gap={1} className='justify-content-center flex-wrap'>
                        {tags.map(tag => (
                            <Badge className='text-truncate' key={tag.id}>{tag.label}</Badge>
                        ))}
                    </Stack>}

                </Stack>
            </Card.Body>
        </Card>
    );
}

function EditTagsModal(availableTags) {
    return <>
    <Modal>
        <Modal.Header closeButton>
            <Modal.Title>
                Edit Tags
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                            <Form.Control type='text' value={tag.id}/>
                            </Col>
                            <Col xs="auto">
                                <Button variant='outline-danger'>&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
    </>
}