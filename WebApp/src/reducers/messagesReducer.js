import createReducer from "src/reducers/utils/createReducer"

const initialState = []

export default createReducer(initialState, {
    GET_MESSAGES_SUCCESS (state, response) {

        /* Exercise 1: Update redux state from response */

        return response.messages
    }
})

/**
 * Message shape: {
 *   author: {
 *     name: author's full name (string),
 *     picture: author's profile image source (string),
 *     userId: author unique ID (string)
 *   },
 *   text: message text (string),
 *   data: message image source (string),
 *   timestampUtc: message timestamp (number),
 *   messageId: message unique ID (string)
 * }
 */
