import { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    Popconfirm,

    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
    useDeleteOtelsMutation,
    useGetAllOtelsQuery, usePostOtelsMutation, usePutOtelsMutation,

} from "../../../services/userApi.jsx";
import { OTEL_CARD_IMAGES } from "../../../contants.js"; // öz constantını buraya qoy
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const OtelsTable = () => {
    const { data: getAllOtel, refetch } = useGetAllOtelsQuery();
    const otels = getAllOtel?.data || [];

    const [postOtel] = usePostOtelsMutation();
    const [putOtel] = usePutOtelsMutation();
    const [deleteOtel] = useDeleteOtelsMutation();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingOtel, setEditingOtel] = useState(null);
    const [cardFileList, setCardFileList] = useState([]);

    // Add Modal aç
    const showAddModal = () => {
        form.resetFields();
        setCardFileList([]);
        setIsAddModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditingOtel(record);
        editForm.setFieldsValue({
            name: record.name,
            location: record.location,
            locationEng: record.locationEng,
            locationRu: record.locationRu,
        });
        setCardFileList(
            record.cardImage
                ? [
                    {
                        uid: "-1",
                        name: record.cardImage,
                        status: "done",
                        url: OTEL_CARD_IMAGES + record.cardImage,
                    },
                ]
                : []
        );
        setIsEditModalVisible(true);
    };

    const handleAddOtel = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("location", values.location);
            formData.append("locationEng", values.locationEng);
            formData.append("locationRu", values.locationRu);
            if (cardFileList[0]?.originFileObj) {
                formData.append("cardImage", cardFileList[0].originFileObj);
            }

            await postOtel(formData).unwrap();
            message.success("Otel uğurla əlavə edildi!");
            setIsAddModalVisible(false);
            refetch();
        } catch (error) {
            message.error("Otel əlavə edilərkən xəta!");
        }
    };

    const handleEditOtel = async (values) => {
        try {
            const formData = new FormData();
            formData.append("id", editingOtel.id);
            formData.append("name", values.name);
            formData.append("location", values.location);
            formData.append("locationEng", values.locationEng);
            formData.append("locationRu", values.locationRu);
            if (cardFileList[0]?.originFileObj) {
                formData.append("cardImage", cardFileList[0].originFileObj);
            }

            await putOtel(formData).unwrap();
            message.success("Otel uğurla redaktə edildi!");
            setIsEditModalVisible(false);
            refetch();
        } catch (error) {
            message.error("Otel redaktə edilərkən xəta!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOtel(id).unwrap();
            message.success("Otel silindi!");
            refetch();
        } catch {
            message.error("Silinərkən xəta!");
        }
    };

    const columns = [
        {
            title: "#",
            render: (text, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Şəkil",
            dataIndex: "cardImage",
            render: (cardImage) =>
                cardImage ? (
                    <img
                        src={OTEL_CARD_IMAGES + cardImage}
                        alt="otel şəkil"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                    />
                ) : (
                    <span>No Image</span>
                ),
        },
        {
            title: "Ad",
            dataIndex: "name",
        },
        {
            title: "Məkan",
            dataIndex: "location",
        },
        {
            title: "Əməliyyatlar",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        <FaRegEdit />
                    </Button>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="default" danger>
                            <MdDeleteForever />
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={showAddModal} className="mb-4">
                +
            </Button>
            <Table rowKey="id" columns={columns} dataSource={otels} pagination={{ pageSize: 6 }} />

            {/* Add Modal */}
            <Modal title="Yeni Otel Əlavə Et" open={isAddModalVisible} onCancel={() => setIsAddModalVisible(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleAddOtel}>
                    <Form.Item name="name" label="Otel Adı" rules={[{ required: true, message: "Ad daxil edin!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Məkan (AZ)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="locationEng" label="Məkan (EN)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="locationRu" label="Məkan (RU)">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Şəkil">
                        <Upload
                            listType="picture-card"
                            fileList={cardFileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setCardFileList(fileList)}
                        >
                            {cardFileList?.length < 1 && (
                                <div>
                                    <PlusOutlined />
                                    <div className="mt-2">Şəkil əlavə et</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Əlavə Et</Button>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal title="Otel Redaktə Et" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)} footer={null}>
                <Form form={editForm} layout="vertical" onFinish={handleEditOtel}>
                    <Form.Item name="name" label="Otel Adı" rules={[{ required: true, message: "Ad daxil edin!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Məkan (AZ)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="locationEng" label="Məkan (EN)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="locationRu" label="Məkan (RU)">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Şəkil">
                        <Upload
                            listType="picture-card"
                            fileList={cardFileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setCardFileList(fileList)}
                        >
                            {cardFileList?.length < 1 && (
                                <div>
                                    <PlusOutlined />
                                    <div className="mt-2">Şəkil əlavə et</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Düzəliş Et</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default OtelsTable;
