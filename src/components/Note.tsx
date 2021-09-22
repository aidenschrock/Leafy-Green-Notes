import Card from '@leafygreen-ui/card';
import IconButton from '@leafygreen-ui/icon-button';
import { H3, Body } from '@leafygreen-ui/typography';
import Icon from '@leafygreen-ui/icon';
import { uiColors } from '@leafygreen-ui/palette';

interface FuncProps {
    handleEdit(index: number): void
    data: any;
    cardId: any;
}


const Note: React.FC<FuncProps> = (props) => {
    return (
        <Card style={{ backgroundColor: uiColors.green.base }} className="card-styles note" as="article">
            <IconButton className="edit-icon" aria-label="Edit Note" onClick={() => {
                props.handleEdit(props.cardId)
            }}>
                <Icon glyph="Edit" size="small" fill="#0D324F" />
            </IconButton>
            <H3 style={{ color: uiColors.white }} className="note-title">{props.data.title}</H3>
            <Body style={{ color: uiColors.white }} weight="medium">{props.data.content}</Body>
        </Card>
    )
}

export default Note;